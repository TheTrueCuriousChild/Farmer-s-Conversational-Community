import asyncio
from datetime import datetime, timedelta
import json
import hashlib
from typing import Dict, List, Any, Optional
import re

class AIServiceHelpers:
    @staticmethod
    def format_response_for_frontend(response_data: Dict[str, Any], 
                                   user_language: str = 'en') -> Dict[str, Any]:
        """Format AI response for frontend consumption."""
        formatted = {
            'id': AIServiceHelpers.generate_response_id(),
            'timestamp': datetime.now().isoformat(),
            'content': response_data.get('response', ''),
            'language': user_language,
            'metadata': {
                'intent': response_data.get('intent', 'general_query'),
                'confidence': response_data.get('confidence', 0.5),
                'sources_count': response_data.get('sources_used', 0),
                'processing_time': response_data.get('processing_time', 0)
            },
            'suggestions': response_data.get('suggestions', []),
            'actions': AIServiceHelpers._generate_action_buttons(
                response_data.get('intent'), user_language
            )
        }
        
        return formatted
    
    @staticmethod
    def generate_response_id() -> str:
        """Generate unique response ID."""
        timestamp = str(int(datetime.now().timestamp() * 1000))
        data = f"response_{timestamp}_{hash(timestamp)}"
        return hashlib.md5(data.encode()).hexdigest()[:12]
    
    @staticmethod
    def _generate_action_buttons(intent: str, language: str) -> List[Dict[str, str]]:
        """Generate contextual action buttons based on intent."""
        buttons = []
        
        button_map = {
            'crop_disease_identification': [
                {'en': 'Upload Image', 'ml': 'ചിത്രം അപ്‌ലോഡ് ചെയ്യുക', 'action': 'upload_image'},
                {'en': 'Get Treatment Plan', 'ml': 'ചികിത്സാ പദ്ധതി എടുക്കുക', 'action': 'get_treatment'},
                {'en': 'Prevention Tips', 'ml': 'പ്രതിരോധ നുറുങ്ങുകൾ', 'action': 'prevention_tips'}
            ],
            'pest_management': [
                {'en': 'Organic Solutions', 'ml': 'ഓർഗാനിക് പരിഹാരങ്ങൾ', 'action': 'organic_solutions'},
                {'en': 'Pesticide Guide', 'ml': 'കീടനാശിനി ഗൈഡ്', 'action': 'pesticide_guide'}
            ],
            'fertilizer_advice': [
                {'en': 'Soil Test Info', 'ml': 'മണ്ണ് പരിശോധനാ വിവരങ്ങൾ', 'action': 'soil_test'},
                {'en': 'Fertilizer Schedule', 'ml': 'വള പ്രയോഗ ഷെഡ്യൂൾ', 'action': 'fertilizer_schedule'}
            ]
        }
        
        intent_buttons = button_map.get(intent, [])
        for button in intent_buttons:
            buttons.append({
                'text': button.get(language, button.get('en')),
                'action': button['action']
            })
        
        return buttons
    
    @staticmethod
    def extract_keywords(text: str, language: str = 'en') -> List[str]:
        """Extract keywords from text for search and categorization."""
        # Simple keyword extraction (can be enhanced with NLP libraries)
        
        # Remove common stop words
        stop_words = {
            'en': {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'},
            'ml': {'ഒരു', 'ഇത്', 'അത്', 'എന്ന്', 'ആണ്', 'ഉണ്ട്', 'ആയി', 'എന്നാൽ', 'പക്ഷേ'}
        }
        
        # Clean and tokenize text
        cleaned_text = re.sub(r'[^\w\s\u0D00-\u0D7F]', '', text.lower())
        words = cleaned_text.split()
        
        # Filter stop words and short words
        current_stop_words = stop_words.get(language, stop_words['en'])
        keywords = [word for word in words if len(word) > 2 and word not in current_stop_words]
        
        # Return top 10 most relevant keywords (can be enhanced with frequency analysis)
        return list(set(keywords))[:10]
    
    @staticmethod
    def calculate_similarity(text1: str, text2: str) -> float:
        """Calculate simple text similarity score."""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        intersection = len(words1.intersection(words2))
        union = len(words1.union(words2))
        
        return intersection / union if union > 0 else 0.0
    
    @staticmethod
    def format_error_response(error_msg: str, language: str = 'en') -> Dict[str, Any]:
        """Format error response for consistent error handling."""
        error_messages = {
            'en': {
                'generic': "I'm sorry, I encountered an issue processing your request. Please try again.",
                'rate_limit': "You've made too many requests. Please wait a moment and try again.",
                'invalid_input': "I couldn't understand your input. Please check and try again.",
                'service_unavailable': "The service is temporarily unavailable. Please try again later."
            },
            'ml': {
                'generic': "ക്ഷമിക്കണം, നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ്സ് ചെയ്യുന്നതിൽ ഒരു പ്രശ്നം നേരിട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
                'rate_limit': "നിങ്ങൾ വളരെയധികം അഭ്യർത്ഥനകൾ നടത്തിയിട്ടുണ്ട്. ദയവായി ഒരു നിമിഷം കാത്തിരുന്ന് വീണ്ടും ശ്രമിക്കുക.",
                'invalid_input': "നിങ്ങളുടെ ഇൻപുട്ട് എനിക്ക് മനസ്സിലാകുന്നില്ല. ദയവായി പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.",
                'service_unavailable': "സേവനം താത്കാലികമായി ലഭ്യമല്ല. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക."
            }
        }
        
        # Determine error type
        error_type = 'generic'
        if 'rate limit' in error_msg.lower():
            error_type = 'rate_limit'
        elif 'invalid' in error_msg.lower():
            error_type = 'invalid_input'
        elif 'unavailable' in error_msg.lower():
            error_type = 'service_unavailable'
        
        lang_messages = error_messages.get(language, error_messages['en'])
        user_message = lang_messages.get(error_type, lang_messages['generic'])
        
        return {
            'success': False,
            'response': user_message,
            'error': error_msg,
            'metadata': {
                'error_type': error_type,
                'language': language,
                'timestamp': datetime.now().isoformat()
            },
            'suggestions': [
                "Try rephrasing your question" if language == 'en' else "നിങ്ങളുടെ ചോദ്യം മാറ്റി പറയാൻ ശ്രമിക്കുക",
                "Contact support if problem persists" if language == 'en' else "പ്രശ്നം തുടരുകയാണെങ്കിൽ സപ്പോർട്ടിനെ ബന്ധപ്പെടുക"
            ]
        }
    
    @staticmethod
    def validate_and_clean_response(response_text: str) -> str:
        """Validate and clean AI response text."""
        if not response_text:
            return "I apologize, but I couldn't generate a proper response. Please try again."
        
        # Remove excessive whitespace
        cleaned = ' '.join(response_text.split())
        
        # Ensure response ends with proper punctuation
        if cleaned and not cleaned.endswith(('.', '!', '?')):
            cleaned += '.'
        
        # Limit response length
        if len(cleaned) > 2000:
            cleaned = cleaned[:1997] + '...'
        
        return cleaned