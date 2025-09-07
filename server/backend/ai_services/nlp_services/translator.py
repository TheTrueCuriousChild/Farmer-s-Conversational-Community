import google.generativeai as genai
from googletrans import Translator
import re
from typing import Optional, Dict, Any

class MultilingualTranslator:
    def __init__(self, gemini_api_key: str):
        genai.configure(api_key=gemini_api_key)
        self.gemini_model = genai.GenerativeModel('gemini-pro')
        self.google_translator = Translator()
        
        # Malayalam-English common agricultural terms
        self.agri_terms = {
            'ml_to_en': {
                'നെല്ല്': 'rice',
                'തെങ്ങ്': 'coconut',
                'കുരുമുളക്': 'pepper',
                'ഇലയാന്': 'cardamom',
                'വാഴ': 'banana',
                'മാവ്': 'mango',
                'തക്കാളി': 'tomato',
                'കീര': 'spinach',
                'ചേന': 'yam'
            },
            'en_to_ml': {
                'rice': 'നെല്ല്',
                'coconut': 'തെങ്ങ്',
                'pepper': 'കുരുമുളക്',
                'cardamom': 'ഇലയാന്',
                'banana': 'വാഴ',
                'mango': 'മാവ്',
                'tomato': 'തക്കാളി',
                'spinach': 'കീര',
                'yam': 'ചേന'
            }
        }
    
    async def translate_with_context(self, text: str, from_lang: str, to_lang: str, context: str = "agricultural") -> str:
        """Translate text using Gemini with agricultural context."""
        try:
            if from_lang == to_lang:
                return text
            
            # Prepare agricultural context prompt
            context_prompt = f"""
            You are translating agricultural text from {from_lang} to {to_lang}.
            Context: {context}
            
            Please translate the following text accurately, preserving agricultural terminology:
            
            Text: {text}
            
            Translation:
            """
            
            response = self.gemini_model.generate_content(context_prompt)
            translated_text = response.text.strip()
            
            # Apply agricultural term corrections
            translated_text = self._apply_agri_terms(translated_text, from_lang, to_lang)
            
            return translated_text
            
        except Exception as e:
            print(f"Gemini translation error: {str(e)}")
            return await self._fallback_translate(text, from_lang, to_lang)
    
    async def _fallback_translate(self, text: str, from_lang: str, to_lang: str) -> str:
        """Fallback translation using Google Translate."""
        try:
            # Map language codes
            lang_map = {'ml': 'ml', 'en': 'en', 'hi': 'hi'}
            src = lang_map.get(from_lang, 'en')
            dest = lang_map.get(to_lang, 'en')
            
            result = self.google_translator.translate(text, src=src, dest=dest)
            translated_text = result.text
            
            # Apply agricultural term corrections
            translated_text = self._apply_agri_terms(translated_text, from_lang, to_lang)
            
            return translated_text
            
        except Exception as e:
            print(f"Fallback translation error: {str(e)}")
            return text
    
    def _apply_agri_terms(self, text: str, from_lang: str, to_lang: str) -> str:
        """Apply agricultural terminology corrections."""
        if from_lang == 'ml' and to_lang == 'en':
            for ml_term, en_term in self.agri_terms['ml_to_en'].items():
                text = text.replace(ml_term, en_term)
        elif from_lang == 'en' and to_lang == 'ml':
            for en_term, ml_term in self.agri_terms['en_to_ml'].items():
                text = re.sub(r'\b' + en_term + r'\b', ml_term, text, flags=re.IGNORECASE)
        
        return text
    
    async def translate_query(self, query: str, target_language: str, user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Translate user query with context preservation."""
        try:
            # Detect source language
            from .language_detector import LanguageDetector
            detector = LanguageDetector()
            lang_info = detector.detect_language(query)
            source_lang = lang_info['language']
            
            if source_lang == target_language:
                return {
                    'original_query': query,
                    'translated_query': query,
                    'source_language': source_lang,
                    'target_language': target_language,
                    'translation_needed': False
                }
            
            # Build context from user information
            context = "agricultural query"
            if user_context:
                if user_context.get('crop'):
                    context += f" about {user_context['crop']}"
                if user_context.get('location'):
                    context += f" in {user_context['location']}"
            
            translated_query = await self.translate_with_context(
                query, source_lang, target_language, context
            )
            
            return {
                'original_query': query,
                'translated_query': translated_query,
                'source_language': source_lang,
                'target_language': target_language,
                'translation_needed': True,
                'context_used': context
            }
            
        except Exception as e:
            print(f"Query translation error: {str(e)}")
            return {
                'original_query': query,
                'translated_query': query,
                'source_language': 'unknown',
                'target_language': target_language,
                'translation_needed': False,
                'error': str(e)
            }