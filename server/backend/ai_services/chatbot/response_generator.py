import google.generativeai as genai
from typing import Dict, List, Any, Optional
import json
import asyncio
from ..rag_pipeline.retriever import DocumentRetriever
from ..nlp_services.translator import MultilingualTranslator
from ..nlp_services.intent_classifier import IntentClassifier

class ResponseGenerator:
    def __init__(self, gemini_api_key: str, retriever: DocumentRetriever, 
                 translator: MultilingualTranslator, intent_classifier: IntentClassifier):
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.retriever = retriever
        self.translator = translator
        self.intent_classifier = intent_classifier
        
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
            }
        }
    
    async def generate_response(self, query: str, context_docs: List[Dict[str, Any]], 
                              user_context: Dict[str, Any], language: str = 'en') -> Dict[str, Any]:
        """Generate a comprehensive response using RAG and LLM."""
        try:
            # Classify intent
            intent_info = await self.intent_classifier.classify_intent_hybrid(query, language)
            intent = intent_info['primary_intent']
            
            # Get template for this intent
            template = self.response_templates.get(intent, self.response_templates['crop_cultivation'])
            
            # Format context from retrieved documents
            context_text = self._format_context(context_docs)
            
            # Build comprehensive prompt
            response_prompt = await self._build_response_prompt(
                query, context_text, template, user_context, language, intent
            )
            
            # Generate response using Gemini
            response = self.model.generate_content(response_prompt)
            generated_text = response.text.strip()
            
            # Post-process response
            processed_response = await self._post_process_response(
                generated_text, language, intent, user_context
            )
            
            return {
                'response': processed_response['text'],
                'intent': intent,
                'confidence': intent_info['confidence'],
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
            print(f"Response generation error: {str(e)}")
            return await self._generate_fallback_response(query, language, str(e))
    
    async def _build_response_prompt(self, query: str, context: str, template: Dict[str, Any], 
                                   user_context: Dict[str, Any], language: str, intent: str) -> str:
        """Build a comprehensive prompt for response generation."""
        
        # System prompt
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
        
        # Language instruction
        lang_instruction = f"Respond in {'Malayalam' if language == 'ml' else 'English'}."
        
        # Structure guidance
        structure = template.get('structure', [])
        structure_guide = ""
        if structure:
            structure_guide = f"Structure your response to cover: {', '.join(structure)}."
        
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

RESPONSE:
"""
        return prompt
    
    def _format_context(self, context_docs: List[Dict[str, Any]]) -> str:
        """Format retrieved documents into context."""
        if not context_docs:
            return "No relevant information found in knowledge base."
        
        formatted_context = []
        for i, doc in enumerate(context_docs, 1):
            content = doc['content']
            source = doc['metadata'].get('file_name', 'Knowledge Base')
            
            formatted_context.append(f"[Reference {i} - {source}]:\n{content}")
        
        return "\n\n".join(formatted_context)
    
    async def _post_process_response(self, response_text: str, language: str, 
                                   intent: str, user_context: Dict[str, Any]) -> Dict[str, Any]:
        """Post-process the generated response."""
        try:
            # Clean up response
            cleaned_response = self._clean_response_text(response_text)
            
            # Add context-specific suggestions
            enhanced_response = await self._add_contextual_suggestions(
                cleaned_response, intent, user_context, language
            )
            
            # Add disclaimers if needed
            final_response = self._add_disclaimers(enhanced_response, intent, language)
            
            return {
                'text': final_response,
                'metadata': {
                    'original_length': len(response_text),
                    'processed_length': len(final_response),
                    'enhancements_added': True
                }
            }
            
        except Exception as e:
            print(f"Post-processing error: {str(e)}")
            return {
                'text': response_text,
                'metadata': {'error': str(e), 'enhancements_added': False}
            }
    
    def _clean_response_text(self, text: str) -> str:
        """Clean and format response text."""
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Ensure proper sentence ending
        if text and not text.endswith(('.', '!', '?')):
            text += '.'
        
        return text
    
    async def _add_contextual_suggestions(self, response: str, intent: str, 
                                        user_context: Dict[str, Any], language: str) -> str:
        """Add contextual suggestions based on intent and user profile."""
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
                suggestion_text = await self.translator.translate_with_context(
                    suggestion_text, 'en', 'ml', 'agricultural advice'
                )
            
            response += f"\n\n{suggestion_text}"
        
        return response
    
    def _add_disclaimers(self, response: str, intent: str, language: str) -> str:
        """Add appropriate disclaimers."""
        disclaimers = []
        
        if intent in ['crop_disease_identification', 'pest_management']:
            disclaimer = "Note: For severe problems, please consult a qualified agricultural expert or your local extension officer."
            disclaimers.append(disclaimer)
        
        if intent == 'fertilizer_advice':
            disclaimer = "Note: Recommendations are general. Soil testing is recommended for precise fertilizer application."
            disclaimers.append(disclaimer)
        
        if disclaimers:
            disclaimer_text = "\n".join(disclaimers)
            
            # Translate disclaimer if needed
            if language == 'ml':
                # Simple Malayalam translation for common disclaimers
                disclaimer_text = disclaimer_text.replace(
                    "Note:", "ശ്രദ്ധിക്കുക:"
                ).replace(
                    "please consult", "ദയവായി ബന്ധപ്പെടുക"
                )
            
            response += f"\n\n{disclaimer_text}"
        
        return response
    
    async def _generate_fallback_response(self, query: str, language: str, error: str) -> Dict[str, Any]:
        """Generate fallback response when main generation fails."""
        fallback_responses = {
            'en': "I apologize, but I'm having trouble processing your question right now. Please try rephrasing your question or contact your local agricultural officer for assistance.",
            'ml': "ക്ഷമിക്കണം, നിങ്ങളുടെ ചോദ്യം ഇപ്പോൾ പ്രോസസ്സ് ചെയ്യുന്നതിൽ എനിക്ക് പ്രശ്നമുണ്ട്. ദയവായി നിങ്ങളുടെ ചോദ്യം മാറ്റി പറയുക അല്ലെങ്കിൽ നിങ്ങളുടെ പ്രാദേശിക കൃഷി ഉദ്യോഗസ്ഥനെ സമീപിക്കുക."
        }
        
        return {
            'response': fallback_responses.get(language, fallback_responses['en']),
            'intent': 'general_query',
            'confidence': 0.1,
            'language': language,
            'sources_used': 0,
            'metadata': {
                'error': error,
                'fallback': True
            }
        }