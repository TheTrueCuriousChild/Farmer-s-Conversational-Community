import google.generativeai as genai
from typing import Dict, List, Any, Optional, Tuple
import json
import asyncio
import re
import speech_recognition as sr
from gtts import gTTS
import io
import tempfile
import os

from ..rag_pipeline.retriever import DocumentRetriever
from ..nlp_services.translator import MultilingualTranslator
from ..nlp_services.intent_classifier import IntentClassifier

class ResponseGenerator:
    def __init__(self, gemini_api_key: str, retriever: DocumentRetriever, 
                 translator: MultilingualTranslator, intent_classifier: IntentClassifier):
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.retriever = retriever
        self.translator = translator
        self.intent_classifier = intent_classifier
        self.recognizer = sr.Recognizer()
        
        # Response templates by intent
        self.response_templates = {
            'crop_disease_identification': {
                'system_prompt': """You are an expert agricultural advisor specializing in plant disease identification. 
                Provide accurate, actionable advice for farmers about crop diseases.""",
                'structure': ['diagnosis', 'causes', 'treatment', 'prevention']
            },
            'pest_management': {
                'system_prompt': """You are an expert in integrated pest management. 
                Provide safe, effective solutions for pest control in agriculture.""",
                'structure': ['identification', 'control_methods', 'organic_options', 'prevention']
            },
            'crop_cultivation': {
                'system_prompt': """You are an agricultural extension officer with expertise in crop cultivation. 
                Provide practical farming advice based on local conditions.""",
                'structure': ['timing', 'methods', 'requirements', 'tips']
            },
            'fertilizer_advice': {
                'system_prompt': """You are a soil and plant nutrition expert. 
                Provide balanced fertilizer recommendations considering soil health and sustainability.""",
                'structure': ['soil_analysis', 'nutrient_needs', 'application_method', 'timing']
            },
            'general': {
                'system_prompt': """You are a helpful agricultural advisor. 
                Provide practical farming advice and guidance.""",
                'structure': ['answer', 'recommendations', 'additional_tips']
            }
        }

    # ----------------- Voice Processing Methods -----------------
    
    async def process_voice_input(self, audio_data: bytes, audio_format: str, 
                                query: str, context_docs: List[Dict[str, Any]],
                                user_context: Dict[str, Any], language: str = 'en') -> Dict[str, Any]:
        """Process voice input and return both text and audio response"""
        try:
            print(f"DEBUG: Processing voice input, audio size: {len(audio_data)} bytes")
            
            # Convert speech to text if no transcript provided
            if not query:
                transcript, detected_lang = await self._speech_to_text(audio_data, audio_format)
                print(f"DEBUG: Speech-to-text result: {transcript}, language: {detected_lang}")
            else:
                transcript = query
                detected_lang = language
            
            # Generate text response using existing method
            text_response = await self.generate_response(
                transcript, context_docs, user_context, detected_lang
            )
            
            # Convert text response to speech (use only the main answer for TTS)
            main_answer_text = text_response.get('main_answer', text_response.get('response', ''))
            audio_response = await self._text_to_speech(
                main_answer_text, 
                detected_lang
            )
            
            return {
                'success': True,
                'transcript': transcript,
                'text_response': text_response,
                'audio_response': audio_response,
                'audio_format': 'mp3',
                'detected_language': detected_lang,
                'metadata': text_response.get('metadata', {})
            }
            
        except Exception as e:
            print(f"DEBUG: Voice processing failed: {str(e)}")
            return {
                'success': False,
                'error': f"Voice processing failed: {str(e)}",
                'transcript': "",
                'text_response': await self._generate_fallback_response("", language, str(e)),
                'audio_response': b"",
                'detected_language': language
            }
    
    async def _speech_to_text(self, audio_data: bytes, audio_format: str) -> Tuple[str, str]:
        """Convert audio to text using Google Speech Recognition"""
        try:
            # Create temporary audio file
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{audio_format}') as tmp:
                tmp.write(audio_data)
                tmp_path = tmp.name
            
            # Use speech recognition
            with sr.AudioFile(tmp_path) as source:
                audio = self.recognizer.record(source)
                
            # Recognize speech
            text = self.recognizer.recognize_google(audio)
            
            # Detect language
            language = self._detect_input_language(text)
            
            # Clean up
            os.unlink(tmp_path)
            
            return text, language
            
        except sr.UnknownValueError:
            raise Exception("Could not understand audio")
        except sr.RequestError as e:
            raise Exception(f"Speech recognition error: {e}")
        finally:
            # Ensure cleanup
            if 'tmp_path' in locals() and os.path.exists(tmp_path):
                try:
                    os.unlink(tmp_path)
                except:
                    pass
    
    async def _text_to_speech(self, text: str, language: str) -> bytes:
        """Convert text to speech using gTTS"""
        try:
            if language == 'ml':
                # Malayalam TTS
                tts = gTTS(text=text, lang='ml')
            else:
                # English TTS
                tts = gTTS(text=text, lang='en')
            
            # Save to bytes buffer
            audio_buffer = io.BytesIO()
            tts.write_to_fp(audio_buffer)
            audio_buffer.seek(0)
            
            return audio_buffer.getvalue()
            
        except Exception as e:
            print(f"DEBUG: TTS failed: {str(e)}")
            # Return empty audio on failure
            return b""
    
    def _detect_input_language(self, text: str) -> str:
        """Detect if input is Malayalam or English"""
        if not text:
            return 'en'
        
        # Simple detection based on Malayalam Unicode range
        malayalam_chars = re.findall(r'[\u0D00-\u0D7F]', text)
        if len(malayalam_chars) > len(text) * 0.3:  # 30% Malayalam characters
            return 'ml'
        return 'en'

    # ----------------- Main Response Generation Methods -----------------
    
    async def generate_response(
        self,
        query: str,
        context_docs: List[Dict[str, Any]],
        user_context: Dict[str, Any],
        language: str = 'en',
        **kwargs
    ) -> Dict[str, Any]:
        """Generate a comprehensive response using RAG and LLM."""
        try:
            print(f"DEBUG: Starting response generation for query: {query}")
            
            # Classify intent
            print("DEBUG: About to classify intent...")
            try:
                intent_info = await self.intent_classifier.classify_intent_hybrid(query, language)
                print(f"DEBUG: Intent classified using hybrid method: {intent_info}")
            except Exception as intent_error:
                print(f"DEBUG: Hybrid intent classification failed: {str(intent_error)}")
                print("DEBUG: Falling back to simple intent classification...")
                intent_info = self._simple_intent_classification(query)
                print(f"DEBUG: Intent classified using fallback: {intent_info}")
            
            intent = intent_info['primary_intent'] if 'primary_intent' in intent_info else intent_info.get('intent', 'general')
            
            # Get template for this intent
            template = self.response_templates.get(intent, self.response_templates['general'])
            print(f"DEBUG: Using template for intent: {intent}")
            
            # Format context from retrieved documents
            context_text = self._format_context(context_docs)
            print(f"DEBUG: Context formatted, length: {len(context_text)}")
            
            # Build comprehensive prompt
            print("DEBUG: Building response prompt...")
            response_prompt = await self._build_response_prompt(
                query, context_text, template, user_context, language, intent
            )
            print(f"DEBUG: Prompt built, length: {len(response_prompt)}")
            
            # Generate response using Gemini
            print("DEBUG: About to call Gemini API...")
            response = await self._safe_generate_content(response_prompt)
            generated_text = response.strip()
            print(f"DEBUG: Gemini response received, length: {len(generated_text)}")
            
            # Parse structured response
            print("DEBUG: Parsing structured response...")
            structured_response = self._parse_structured_response(generated_text)
            print("DEBUG: Response parsed successfully")
            
            # Post-process response
            print("DEBUG: Post-processing response...")
            processed_response = await self._post_process_response(
                structured_response, language, intent, user_context
            )
            print("DEBUG: Response post-processed successfully")
            
            return {
                'response': processed_response['html_response'],  # HTML formatted
                'main_answer': processed_response['main_answer'],  # Plain text main answer
                'context': processed_response['context'],  # Plain text context
                'intent': intent,
                'confidence': intent_info.get('confidence', 0.8),
                'language': language,
                'sources_used': len(context_docs),
                'metadata': {
                    'intent_info': intent_info,
                    'context_docs': context_docs,
                    'user_context': user_context,
                    'processing_info': processed_response['metadata']
                }
            }
            
        except Exception as e:
            print(f"DEBUG: Exception in generate_response: {str(e)}")
            import traceback
            traceback.print_exc()
            return await self._generate_fallback_response(query, language, str(e))

    def _parse_structured_response(self, ai_response: str) -> Dict[str, str]:
        """Parse the AI response into main answer and context"""
        # Try to extract structured format first
        if "[MAIN_ANSWER]" in ai_response and "[CONTEXT]" in ai_response:
            try:
                main_part = ai_response.split("[MAIN_ANSWER]")[1].split("[CONTEXT]")[0].strip()
                context_part = ai_response.split("[CONTEXT]")[1].strip()
                return {"main_answer": main_part, "context": context_part}
            except Exception as e:
                print(f"DEBUG: Structured parsing failed, using fallback: {str(e)}")
        
        # Fallback: use first sentence as main answer
        sentences = re.split(r'[.!?]+', ai_response)
        if sentences:
            main_part = sentences[0].strip() + ('.' if not sentences[0].endswith('.') else '')
            context_part = '. '.join([s.strip() for s in sentences[1:] if s.strip()])
        else:
            main_part = ai_response
            context_part = ""
        
        return {"main_answer": main_part, "context": context_part}

    def _format_response_html(self, main_answer: str, context: str, language: str) -> str:
        """Format the response with HTML styling for larger main text"""
        # Different styling based on language for better readability
        if language == 'ml':
            # Malayalam styling
            return f"""
            <div style="margin-bottom: 20px; font-family: 'Manjari', 'Noto Sans Malayalam', sans-serif;">
                <div style="font-size: 1.6em; font-weight: 700; color: #1a472a; 
                           line-height: 1.4; margin-bottom: 15px; background: #f8fffe;
                           padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60;">
                    {main_answer}
                </div>
                <div style="font-size: 1.1em; color: #2d3748; line-height: 1.6; 
                           padding: 0 10px;">
                    {context}
                </div>
            </div>
            """
        else:
            # English styling
            return f"""
            <div style="margin-bottom: 20px; font-family: Arial, sans-serif;">
                <div style="font-size: 1.5em; font-weight: 600; color: #1a472a; 
                           line-height: 1.3; margin-bottom: 12px; background: #f0fff4;
                           padding: 12px; border-radius: 6px; border-left: 4px solid #38a169;">
                    {main_answer}
                </div>
                <div style="font-size: 1em; color: #4a5568; line-height: 1.5;">
                    {context}
                </div>
            </div>
            """

    async def _safe_generate_content(self, prompt: str) -> str:
        """Safely generate content with Gemini, with fallbacks"""
        try:
            # Try async first
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            if response and hasattr(response, 'text'):
                return response.text
            else:
                print("DEBUG: No text in Gemini response, trying sync...")
                # Fallback to sync call
                response = self.model.generate_content(prompt)
                return response.text if response else "I apologize, but I couldn't generate a proper response."
        except Exception as e:
            print(f"DEBUG: Gemini API call failed: {str(e)}")
            # Return a basic response based on intent
            return self._generate_basic_response(prompt)

    def _generate_basic_response(self, prompt: str) -> str:
        """Generate a basic response when Gemini fails"""
        if "disease" in prompt.lower():
            return "[MAIN_ANSWER] For plant diseases, examine symptoms like yellowing leaves or spots carefully. [CONTEXT] Common signs include discoloration, wilting, or unusual growth. Consult your local agricultural extension officer for proper diagnosis and specific treatment recommendations based on your crop and region."
        elif "pest" in prompt.lower():
            return "[MAIN_ANSWER] For pest management, start by identifying the specific pest affecting your crops. [CONTEXT] Use integrated pest management approaches beginning with organic methods like neem oil or beneficial insects. Consider chemical treatments only when necessary and follow safety guidelines."
        elif "fertilizer" in prompt.lower():
            return "[MAIN_ANSWER] For fertilizer advice, soil testing is recommended first for precise recommendations. [CONTEXT] Generally, balanced NPK fertilizers work well, but specific needs depend on your crop type, soil conditions, and growth stage. Organic options like compost are also beneficial."
        else:
            return "[MAIN_ANSWER] I'd be happy to help with your agricultural question. [CONTEXT] For specific advice, please provide more details about your crop, location, and the specific issue you're facing to get the most accurate guidance."

    def _simple_intent_classification(self, query: str) -> Dict[str, Any]:
        """Simple fallback intent classification"""
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['disease', 'sick', 'infected', 'spots', 'yellowing', 'wilting']):
            return {'intent': 'crop_disease_identification', 'confidence': 0.7, 'primary_intent': 'crop_disease_identification'}
        elif any(word in query_lower for word in ['pest', 'insect', 'bug', 'caterpillar']):
            return {'intent': 'pest_management', 'confidence': 0.7, 'primary_intent': 'pest_management'}
        elif any(word in query_lower for word in ['fertilizer', 'manure', 'nutrients', 'feeding']):
            return {'intent': 'fertilizer_advice', 'confidence': 0.7, 'primary_intent': 'fertilizer_advice'}
        elif any(word in query_lower for word in ['grow', 'plant', 'cultivation', 'farming']):
            return {'intent': 'crop_cultivation', 'confidence': 0.7, 'primary_intent': 'crop_cultivation'}
        else:
            return {'intent': 'general', 'confidence': 0.5, 'primary_intent': 'general'}

    async def _build_response_prompt(self, query: str, context: str, template: Dict[str, Any], 
                                     user_context: Dict[str, Any], language: str, intent: str) -> str:
        system_prompt = template['system_prompt']
        
        # User context information
        context_info = ""
        if user_context.get('crop'):
            context_info += f"Farmer's crop: {user_context['crop']}\n"
        if user_context.get('location'):
            context_info += f"Location: {user_context['location']}\n"
        if user_context.get('farming_type'):
            context_info += f"Farming type: {user_context['farming_type']}\n"
        if user_context.get('experience_level'):
            context_info += f"Experience level: {user_context['experience_level']}\n"
        
        lang_instruction = f"Respond in {'Malayalam' if language == 'ml' else 'English'}."
        structure = template.get('structure', [])
        structure_guide = f"Structure your response to cover: {', '.join(structure)}." if structure else ""
        
        # NEW: Add structured response instructions
        structured_instructions = """
RESPONSE FORMAT:
1. First, provide a direct, concise answer in ONE short sentence (max 15-20 words). Start with [MAIN_ANSWER]
2. Then, provide detailed explanation and context. Start with [CONTEXT]

Example:
[MAIN_ANSWER] Your plants likely have fungal leaf spot disease.
[CONTEXT] This is caused by humid conditions and can be treated with copper-based fungicides. Ensure proper spacing between plants for air circulation and avoid overhead watering to prevent spread.
"""

        prompt = f"""
{system_prompt}

{lang_instruction}

FARMER'S CONTEXT:
{context_info if context_info else "No specific context provided."}

RELEVANT KNOWLEDGE:
{context if context else "No specific knowledge base information available."}

FARMER'S QUESTION: {query}

INSTRUCTIONS:
1. Provide a helpful, accurate response based on the knowledge provided
2. {structure_guide}
3. Make the response practical and actionable
4. Use simple language appropriate for farmers
5. If the question is unclear, ask for clarification
6. If you don't have enough information, suggest consulting local agricultural officers

{structured_instructions}

RESPONSE:
"""
        return prompt

    def _format_context(self, context_docs: List[Dict[str, Any]]) -> str:
        if not context_docs:
            return "No relevant information found in knowledge base."
        formatted_context = []
        for i, doc in enumerate(context_docs, 1):
            content = doc['content']
            source = doc['metadata'].get('file_name', 'Knowledge Base')
            formatted_context.append(f"[Reference {i} - {source}]:\n{content}")
        return "\n\n".join(formatted_context)

    async def _post_process_response(self, structured_response: Dict[str, str], language: str, 
                                     intent: str, user_context: Dict[str, Any]) -> Dict[str, Any]:
        try:
            main_answer = self._clean_response_text(structured_response['main_answer'])
            context = self._clean_response_text(structured_response['context'])
            
            # Add contextual suggestions to context
            enhanced_context = await self._add_contextual_suggestions(context, intent, user_context, language)
            
            # Add disclaimers
            final_context = self._add_disclaimers(enhanced_context, intent, language)
            
            # Format HTML response
            html_response = self._format_response_html(main_answer, final_context, language)
            
            return {
                'main_answer': main_answer,
                'context': final_context,
                'html_response': html_response,
                'metadata': {
                    'original_main_length': len(main_answer),
                    'original_context_length': len(context),
                    'enhancements_added': True
                }
            }
        except Exception as e:
            print(f"Post-processing error: {str(e)}")
            # Fallback to simple formatting
            html_response = self._format_response_html(
                structured_response.get('main_answer', ''),
                structured_response.get('context', ''),
                language
            )
            return {
                'main_answer': structured_response.get('main_answer', ''),
                'context': structured_response.get('context', ''),
                'html_response': html_response,
                'metadata': {'error': str(e), 'enhancements_added': False}
            }

    def _clean_response_text(self, text: str) -> str:
        if not text:
            return ""
        text = ' '.join(text.split())
        if text and not text.endswith(('.', '!', '?')):
            text += '.'
        return text

    async def _add_contextual_suggestions(self, response: str, intent: str, 
                                          user_context: Dict[str, Any], language: str) -> str:
        suggestions = []
        if intent == 'crop_disease_identification':
            suggestions.append("Consider taking a photo of the affected area for more accurate diagnosis.")
        if intent == 'pest_management':
            suggestions.append("Always try organic methods first before using chemical pesticides.")
        if intent == 'fertilizer_advice':
            suggestions.append("Get your soil tested for precise nutrient recommendations.")
        if user_context.get('location'):
            suggestions.append(f"Consult your local Krishibhavan in {user_context['location']} for region-specific advice.")
        
        if suggestions:
            suggestion_text = "Additional suggestions:\n" + "\n".join(f"• {s}" for s in suggestions)
            if language == 'ml':
                # Simple translation fallback if translator fails
                try:
                    suggestion_text = await self.translator.translate_with_context(suggestion_text, 'en', 'ml', 'agricultural advice')
                except:
                    print("DEBUG: Translation failed, keeping English suggestions")
            response += f"\n\n{suggestion_text}"
        return response

    def _add_disclaimers(self, response: str, intent: str, language: str) -> str:
        disclaimers = []
        if intent in ['crop_disease_identification', 'pest_management']:
            disclaimers.append("Note: For severe problems, please consult a qualified agricultural expert or your local extension officer.")
        if intent == 'fertilizer_advice':
            disclaimers.append("Note: Recommendations are general. Soil testing is recommended for precise fertilizer application.")
        if disclaimers:
            disclaimer_text = "\n".join(disclaimers)
            if language == 'ml':
                disclaimer_text = disclaimer_text.replace("Note:", "ശ്രദ്ധിക്കുക:").replace("please consult", "ദയവായി ബന്ധപ്പെടുക")
            response += f"\n\n{disclaimer_text}"
        return response

    async def _generate_fallback_response(self, query: str, language: str, error: str) -> Dict[str, Any]:
        fallback_responses = {
            'en': {
                'main_answer': "I'm having trouble processing your question right now.",
                'context': "Please try rephrasing your question or contact your local agricultural officer for assistance."
            },
            'ml': {
                'main_answer': "ക്ഷമിക്കണം, നിങ്ങളുടെ ചോദ്യം ഇപ്പോൾ പ്രോസസ്സ് ചെയ്യുന്നതിൽ എനിക്ക് പ്രശ്നമുണ്ട്.",
                'context': "ദയവായി നിങ്ങളുടെ ചോദ്യം മാറ്റി പറയുക അല്ലെങ്കിൽ നിങ്ങളുടെ പ്രാദേശിക കൃഷി ഉദ്യോഗസ്ഥനെ സമീപിക്കുക."
            }
        }
        
        fallback = fallback_responses.get(language, fallback_responses['en'])
        html_response = self._format_response_html(fallback['main_answer'], fallback['context'], language)
        
        return {
            'response': html_response,
            'main_answer': fallback['main_answer'],
            'context': fallback['context'],
            'intent': 'general_query',
            'confidence': 0.1,
            'language': language,
            'sources_used': 0,
            'metadata': {'error': error, 'fallback': True}
        }
