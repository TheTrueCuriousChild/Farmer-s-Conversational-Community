import re
import spacy
from typing import List, Dict, Any, Optional

class TextPreprocessor:
    def __init__(self):
        # Load spaCy model (download with: python -m spacy download en_core_web_sm)
        try:
            self.nlp_en = spacy.load("en_core_web_sm")
        except OSError:
            print("English spaCy model not found. Using basic preprocessing.")
            self.nlp_en = None
        
        # Agricultural keywords for context detection
        self.agri_keywords = {
            'crops': ['rice', 'wheat', 'corn', 'banana', 'coconut', 'pepper', 'cardamom', 'നെല്ല്', 'തെങ്ങ്'],
            'diseases': ['blight', 'rust', 'rot', 'wilt', 'mold', 'fungus', 'രോഗം', 'കീടം'],
            'pests': ['aphid', 'caterpillar', 'pest', 'insect', 'bug', 'കീടം'],
            'weather': ['rain', 'drought', 'humidity', 'temperature', 'മഴ', 'വെയില്'],
            'fertilizer': ['fertilizer', 'manure', 'organic', 'urea', 'ഗോബർ'],
            'irrigation': ['water', 'irrigation', 'drip', 'sprinkler', 'നീർവാര്']
        }
    
    def clean_text(self, text: str, language: str = 'en') -> str:
        """Clean and normalize text."""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Handle Malayalam text
        if language == 'ml':
            # Keep Malayalam characters and basic punctuation
            text = re.sub(r'[^\w\s\u0D00-\u0D7F\.,\?!]', '', text)
        else:
            # For English, remove special characters except basic punctuation
            text = re.sub(r'[^\w\s\.,\?!]', '', text)
        
        return text
    
    def extract_entities(self, text: str, language: str = 'en') -> Dict[str, List[str]]:
        """Extract named entities and agricultural terms."""
        entities = {
            'crops': [],
            'diseases': [],
            'pests': [],
            'locations': [],
            'organizations': [],
            'agricultural_terms': []
        }
        
        # Use spaCy for English text
        if language == 'en' and self.nlp_en:
            doc = self.nlp_en(text)
            
            # Extract named entities
            for ent in doc.ents:
                if ent.label_ in ['GPE', 'LOC']:  # Geographical entities
                    entities['locations'].append(ent.text)
                elif ent.label_ == 'ORG':  # Organizations
                    entities['organizations'].append(ent.text)
        
        # Extract agricultural keywords
        text_lower = text.lower()
        for category, keywords in self.agri_keywords.items():
            for keyword in keywords:
                if keyword.lower() in text_lower:
                    if category not in entities:
                        entities[category] = []
                    entities[category].append(keyword)
        
        # Remove duplicates
        for key in entities:
            entities[key] = list(set(entities[key]))
        
        return entities
    
    def extract_intent_keywords(self, text: str) -> List[str]:
        """Extract keywords that indicate user intent."""
        intent_patterns = {
            'question': r'\b(what|how|when|where|why|which|কি|কীভাবে|কখন|কোথায়|কেন)\b',
            'problem': r'\b(problem|issue|disease|pest|damaged|রোগ|সমস্যা|ক্ষতি)\b',
            'advice': r'\b(advice|help|suggest|recommend|guidance|পরামর্শ|সাহায্য)\b',
            'information': r'\b(information|details|about|know|তথ্য|জানতে)\b'
        }
        
        detected_intents = []
        text_lower = text.lower()
        
        for intent, pattern in intent_patterns.items():
            if re.search(pattern, text_lower, re.IGNORECASE):
                detected_intents.append(intent)
        
        return detected_intents