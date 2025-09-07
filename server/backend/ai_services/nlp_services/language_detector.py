from langdetect import detect, DetectorFactory
from googletrans import Translator
import re
from typing import Dict, Any, Optional

class LanguageDetector:
    def __init__(self):
        DetectorFactory.seed = 0  # For consistent results
        self.translator = Translator()
        
        # Malayalam character range
        self.malayalam_pattern = re.compile(r'[\u0D00-\u0D7F]')
        
    def detect_language(self, text: str) -> Dict[str, Any]:
        """Detect language with confidence score."""
        try:
            # Check for Malayalam characters
            malayalam_chars = len(self.malayalam_pattern.findall(text))
            total_chars = len(re.sub(r'\s', '', text))
            
            if total_chars == 0:
                return {'language': 'unknown', 'confidence': 0.0}
            
            malayalam_ratio = malayalam_chars / total_chars
            
            # If more than 30% Malayalam characters, likely Malayalam
            if malayalam_ratio > 0.3:
                return {'language': 'ml', 'confidence': min(0.9, malayalam_ratio + 0.3)}
            
            # Use langdetect for other languages
            detected_lang = detect(text)
            
            # Map language codes
            lang_mapping = {
                'en': 'en',
                'hi': 'hi',
                'ta': 'ta',
                'te': 'te',
                'kn': 'kn'
            }
            
            final_lang = lang_mapping.get(detected_lang, 'en')
            confidence = 0.8 if final_lang == detected_lang else 0.6
            
            return {'language': final_lang, 'confidence': confidence}
            
        except Exception as e:
            print(f"Language detection error: {str(e)}")
            return {'language': 'en', 'confidence': 0.5}
    
    def is_mixed_language(self, text: str) -> bool:
        """Check if text contains mixed languages."""
        malayalam_chars = len(self.malayalam_pattern.findall(text))
        english_chars = len(re.findall(r'[a-zA-Z]', text))
        
        return malayalam_chars > 0 and english_chars > 0
