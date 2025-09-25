from typing import Dict, Any, List, Optional
import asyncio
from .response_generator import ResponseGenerator
from .context_manager import ConversationContextManager

class ConversationHandler:
    def __init__(self, response_generator: ResponseGenerator, 
                 context_manager: ConversationContextManager):
        self.response_generator = response_generator
        self.context_manager = context_manager
        
        # Simple language detection patterns
        self.malayalam_pattern = r'[\u0D00-\u0D7F]'
    
    async def handle_user_message(self, user_id: str, message: str, 
                                 user_profile: Dict[str, Any] = None) -> Dict[str, Any]:
        """Handle a complete user message and generate response."""
        try:
            # Detect language
            detected_language = self._detect_language(message)
            
            # Get user context
            user_context = await self.context_manager.get_user_context(user_id)
            
            # Update context with user profile if provided
            if user_profile:
                user_context.update(user_profile)
            
            # Extract additional context from the message
            message_context = await self.context_manager.extract_context_from_query(message, user_context)
            if message_context:
                user_context = await self.context_manager.update_user_context(user_id, message_context)
            
            # Classify intent
            intent_info = self._classify_intent(message, detected_language)
            
            # Get relevant context (simplified - no RAG retrieval)
            context_docs = self._get_simple_context(message, intent_info)
            
            # Generate response - FIXED: Pass arguments correctly
            response_data = await self.response_generator.generate_response(
                query=message,
                context_docs=context_docs,
                user_context=user_context,
                language=detected_language
            )
            
            # Add to conversation history
            await self.context_manager.add_to_conversation_history(user_id, {
                'type': 'user',
                'content': message,
                'language': detected_language
            })
            
            await self.context_manager.add_to_conversation_history(user_id, {
                'type': 'assistant',
                'content': response_data['response'],  # HTML formatted response
                'main_answer': response_data['main_answer'],  # Plain text main answer
                'context': response_data['context'],  # Plain text context
                'language': detected_language,
                'intent': response_data['intent'],
                'confidence': response_data['confidence']
            })
            
            # Update conversation count
            await self.context_manager.update_user_context(user_id, {
                'conversation_count': user_context.get('conversation_count', 0) + 1
            })
            
            # Prepare final response with new structure
            return {
                'success': True,
                'response': response_data['response'],  # HTML formatted
                'main_answer': response_data['main_answer'],  # Plain text main answer
                'context': response_data['context'],  # Plain text context
                'metadata': {
                    'language_detected': detected_language,
                    'intent': response_data['intent'],
                    'confidence': response_data['confidence'],
                    'sources_count': response_data['sources_used'],
                    'user_context': user_context
                },
                'suggestions': await self._get_follow_up_suggestions(
                    response_data['intent'], detected_language, user_context
                )
            }
            
        except Exception as e:
            print(f"Conversation handling error: {str(e)}")
            return await self._handle_error(user_id, message, str(e))
    
    def _detect_language(self, text: str) -> str:
        """Simple language detection."""
        import re
        malayalam_chars = len(re.findall(self.malayalam_pattern, text))
        total_chars = len(re.sub(r'\s', '', text))
        
        if total_chars == 0:
            return 'en'
        
        malayalam_ratio = malayalam_chars / total_chars
        return 'ml' if malayalam_ratio > 0.3 else 'en'
    
    def _classify_intent(self, message: str, language: str) -> Dict[str, Any]:
        """Simple intent classification."""
        import re
        message_lower = message.lower()
        
        # Intent patterns
        intents = {
            'disease_identification': [
                r'\b(disease|sick|infected|spots|yellowing|wilting|രോഗം|രോഗബാധിത)\b',
                r'\b(leaf|leaves|stem|root|ഇല|തണ്ട്|വേര്)\b'
            ],
            'pest_control': [
                r'\b(pest|insect|bug|caterpillar|കീടം|പുഴു)\b',
                r'\b(control|spray|treatment|നിയന്ത്രണം|ചികിത്സ)\b'
            ],
            'cultivation': [
                r'\b(grow|plant|cultivation|farming|കൃഷി|നട്ട്)\b',
                r'\b(season|time|when|എപ്പോൾ|സമയം)\b'
            ],
            'fertilizer_advice': [
                r'\b(fertilizer|manure|nutrients|വളം|പോഷകങ്ങൾ)\b',
                r'\b(apply|use|dose|ഉപയോഗം|അളവ്)\b'
            ],
            'general': [r'\b(what|how|when|where|കി|എങ്ങനെ|എപ്പോൾ|എവിടെ)\b']
        }
        
        # Score each intent
        scores = {}
        for intent, patterns in intents.items():
            score = 0
            for pattern in patterns:
                matches = len(re.findall(pattern, message_lower, re.IGNORECASE))
                score += matches * 0.3
            if score > 0:
                scores[intent] = min(score, 1.0)
        
        # Get best intent
        if scores:
            best_intent = max(scores.keys(), key=lambda k: scores[k])
            confidence = scores[best_intent]
        else:
            best_intent = 'general'
            confidence = 0.1
        
        return {
            'intent': best_intent,
            'confidence': confidence,
            'all_scores': scores
        }
    
    def _get_simple_context(self, message: str, intent_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get simple context without RAG pipeline."""
        # Basic agricultural knowledge
        knowledge_base = {
            'rice': {
                'diseases': 'Common rice diseases: blast, bacterial blight, brown spot',
                'pests': 'Common rice pests: stem borer, brown planthopper, leaf folder',
                'cultivation': 'Rice requires well-drained soil with pH 5.5-7.0. Plant during monsoon season.',
                'fertilizers': 'Use 90kg/ha Urea, 125kg/ha SSP, 50kg/ha MOP'
            },
            'coconut': {
                'diseases': 'Common coconut diseases: root rot, leaf spot, bud rot',
                'pests': 'Common coconut pests: rhinoceros beetle, red palm weevil, coconut mite',
                'cultivation': 'Coconut grows best in coastal areas with well-drained sandy loam soil.',
                'fertilizers': 'Apply 500g urea, 320g SSP, 750g MOP per palm per year'
            }
        }
        
        context_docs = []
        message_lower = message.lower()
        intent = intent_info['intent']
        
        # Find relevant crop
        for crop, info in knowledge_base.items():
            if crop in message_lower:
                if intent == 'disease_identification' and 'diseases' in info:
                    context_docs.append({
                        'content': info['diseases'],
                        'metadata': {'source': f'{crop}_diseases', 'relevance': 0.8}
                    })
                elif intent == 'pest_control' and 'pests' in info:
                    context_docs.append({
                        'content': info['pests'],
                        'metadata': {'source': f'{crop}_pests', 'relevance': 0.8}
                    })
                elif intent == 'cultivation':
                    context_docs.append({
                        'content': info['cultivation'],
                        'metadata': {'source': f'{crop}_cultivation', 'relevance': 0.8}
                    })
                elif intent == 'fertilizer_advice':
                    context_docs.append({
                        'content': info['fertilizers'],
                        'metadata': {'source': f'{crop}_fertilizers', 'relevance': 0.8}
                    })
                break
        
        return context_docs
    
    async def _get_follow_up_suggestions(self, intent: str, language: str, 
                                       user_context: Dict[str, Any]) -> List[str]:
        """Generate follow-up suggestions based on intent and context."""
        suggestions = []
        
        suggestion_map = {
            'disease_identification': [
                "Would you like to upload an image of the affected plant?",
                "Do you need information about preventive measures?",
                "Should I suggest organic treatment options?"
            ],
            'pest_control': [
                "Do you want to know about organic pest control methods?",
                "Would you like information about beneficial insects?",
                "Should I explain integrated pest management?"
            ],
            'cultivation': [
                "Do you need information about the best planting time?",
                "Would you like to know about soil preparation?",
                "Should I explain irrigation requirements?"
            ],
            'fertilizer_advice': [
                "Do you want to know about organic fertilizers?",
                "Should I explain soil testing procedures?",
                "Would you like a fertilizer application schedule?"
            ],
            'general': [
                "Do you have any other farming questions?",
                "Would you like information about government schemes?",
                "Should I help with market price information?"
            ]
        }
        
        base_suggestions = suggestion_map.get(intent, suggestion_map['general'])
        
        # Translate suggestions if needed
        if language == 'ml':
            ml_suggestions = {
                "Do you have any other farming questions?": "മറ്റേതെങ്കിലും കൃഷി ചോദ്യങ്ങളുണ്ടോ?",
                "Would you like information about government schemes?": "സർക്കാർ സ്കീമുകളെക്കുറിച്ച് അറിയാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?",
                "Should I help with market price information?": "മാർക്കറ്റ് വില വിവരങ്ങളിൽ സഹായിക്കണോ?",
                "Would you like to upload an image of the affected plant?": "ബാധിച്ച ചെടിയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്യാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?",
                "Do you need information about preventive measures?": "പ്രതിരോധ നടപടികളെക്കുറിച്ച് വിവരങ്ങൾ വേണോ?",
                "Should I suggest organic treatment options?": "ഓർഗാനിക് ചികിത്സാ ഓപ്ഷനുകൾ നിർദ്ദേശിക്കണോ?",
                "Do you want to know about organic pest control methods?": "ഓർഗാനിക് കീട നിയന്ത്രണ രീതികളെക്കുറിച്ച് അറിയാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?",
                "Would you like information about beneficial insects?": "ഗുണകരമായ പ്രാണികളെക്കുറിച്ച് വിവരങ്ങൾ വേണോ?",
                "Should I explain integrated pest management?": "സമഗ്ര കീട നിയന്ത്രണത്തെക്കുറിച്ച് വിശദീകരിക്കണോ?",
                "Do you need information about the best planting time?": "ഏറ്റവും നല്ല നടീൽ സമയത്തെക്കുറിച്ച് വിവരങ്ങൾ വേണോ?",
                "Would you like to know about soil preparation?": "മണ്ണ് തയ്യാറാക്കുന്നതിനെക്കുറിച്ച് അറിയാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?",
                "Should I explain irrigation requirements?": "ജലസേചന ആവശ്യകതകൾ വിശദീകരിക്കണോ?",
                "Do you want to know about organic fertilizers?": "ഓർഗാനിക് വളങ്ങളെക്കുറിച്ച് അറിയാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?",
                "Should I explain soil testing procedures?": "മണ്ണ് പരിശോധനാ നടപടിക്രമങ്ങൾ വിശദീകരിക്കണോ?",
                "Would you like a fertilizer application schedule?": "വള പ്രയോഗ ഷെഡ്യൂൾ വേണോ?"
            }
            
            translated_suggestions = []
            for suggestion in base_suggestions[:3]:  # Limit to 3 suggestions
                translated = ml_suggestions.get(suggestion, suggestion)
                translated_suggestions.append(translated)
            suggestions = translated_suggestions
        else:
            suggestions = base_suggestions[:3]
        
        return suggestions
    
    async def _handle_error(self, user_id: str, message: str, error: str) -> Dict[str, Any]:
        """Handle errors gracefully."""
        detected_language = self._detect_language(message)
        
        error_responses = {
            'en': {
                'main_answer': "I'm having trouble processing your question right now.",
                'context': "Please try rephrasing your question or contact your local agricultural officer for assistance."
            },
            'ml': {
                'main_answer': "ക്ഷമിക്കണം, നിങ്ങളുടെ ചോദ്യം ഇപ്പോൾ പ്രോസസ്സ് ചെയ്യുന്നതിൽ എനിക്ക് പ്രശ്നമുണ്ട്.",
                'context': "ദയവായി നിങ്ങളുടെ ചോദ്യം മാറ്റി പറയുക അല്ലെങ്കിൽ നിങ്ങളുടെ പ്രാദേശിക കൃഷി ഉദ്യോഗസ്ഥനെ സമീപിക്കുക."
            }
        }
        
        fallback = error_responses.get(detected_language, error_responses['en'])
        
        # Format error response with HTML
        html_response = f"""
        <div style="margin-bottom: 20px; font-family: Arial, sans-serif;">
            <div style="font-size: 1.5em; font-weight: 600; color: #d63031; 
                       line-height: 1.3; margin-bottom: 12px; background: #ffeaa7;
                       padding: 12px; border-radius: 6px; border-left: 4px solid #e17055;">
                {fallback['main_answer']}
            </div>
            <div style="font-size: 1em; color: #636e72; line-height: 1.5;">
                {fallback['context']}
            </div>
        </div>
        """
        
        return {
            'success': False,
            'response': html_response,
            'main_answer': fallback['main_answer'],
            'context': fallback['context'],
            'error': error,
            'metadata': {
                'language_detected': detected_language,
                'intent': 'error',
                'confidence': 0.0
            },
            'suggestions': [
                "Try rephrasing your question" if detected_language == 'en' else "നിങ്ങളുടെ ചോദ്യം മാറ്റി പറയാൻ ശ്രമിക്കുക",
                "Contact local agricultural officer" if detected_language == 'en' else "പ്രാദേശിക കൃഷി ഉദ്യോഗസ്ഥനെ ബന്ധപ്പെടുക"
            ]
        }
    
    async def get_conversation_summary(self, user_id: str) -> Dict[str, Any]:
        """Get a summary of the user's conversation."""
        try:
            history = await self.context_manager.get_conversation_history(user_id, 10)
            context = await self.context_manager.get_user_context(user_id)
            
            if not history:
                return {
                    'summary': 'No conversation history found.',
                    'total_messages': 0,
                    'main_topics': [],
                    'user_context': context
                }
            
            # Analyze conversation topics
            topics = []
            user_messages = [msg for msg in history if msg.get('type') == 'user']
            
            for msg in user_messages:
                # Simple topic extraction
                content = msg.get('content', '').lower()
                if any(word in content for word in ['disease', 'sick', 'infected', 'രോഗം']):
                    topics.append('disease_management')
                elif any(word in content for word in ['pest', 'insect', 'കീടം']):
                    topics.append('pest_control')
                elif any(word in content for word in ['fertilizer', 'manure', 'വളം']):
                    topics.append('fertilization')
                elif any(word in content for word in ['plant', 'grow', 'cultivation', 'കൃഷി']):
                    topics.append('cultivation')
            
            # Remove duplicates and get unique topics
            unique_topics = list(set(topics))
            
            return {
                'summary': f'User has had {len(history)} interactions covering topics like {", ".join(unique_topics)}',
                'total_messages': len(history),
                'main_topics': unique_topics,
                'user_context': context,
                'recent_activity': history[:3]  # Last 3 messages
            }
            
        except Exception as e:
            print(f"Error getting conversation summary: {str(e)}")
            return {
                'summary': 'Error retrieving conversation summary.',
                'total_messages': 0,
                'main_topics': [],
                'error': str(e)
            }
