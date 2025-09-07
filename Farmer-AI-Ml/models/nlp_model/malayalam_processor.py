import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel, MBartForConditionalGeneration, MBart50TokenizerFast
import numpy as np
import re
from typing import Dict, Tuple

class MalayalamNLP:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {self.device}")
        
        try:
            self.tokenizer = AutoTokenizer.from_pretrained("ai4bharat/indic-bert")
            self.model = AutoModel.from_pretrained("ai4bharat/indic-bert").to(self.device)
            print("✅ Multilingual NLP model loaded successfully")
        except Exception as e:
            print(f"❌ Failed to load model: {e}")
            self.model = None
        
        # Load translation model for English support
        self.translator = None
        self.load_translator()
        
        # Agricultural keywords for both languages
        self.intent_keywords = {
            'pest_control': {
                'ml': ['പുള്ളി', 'രോഗ', 'കീട', 'തുമ്പ്', 'ചികിത്സ', 'മരുന്ന്', 'പുഴു'],
                'en': ['pest', 'disease', 'insect', 'worm', 'treatment', 'pesticide', 'fungicide']
            },
            'fertilizer_advice': {
                'ml': ['വളം', 'ഉരുള', 'ജൈവവളം', 'രാസവളം', 'npk', 'യൂറിയ'],
                'en': ['fertilizer', 'manure', 'compost', 'npk', 'urea', 'dap', 'potassium']
            },
            'weather_query': {
                'ml': ['മഴ', 'വെയില', 'കാലാവസ്ഥ', 'മഞ്ഞ്', 'ആർദ്രത', 'താപനില'],
                'en': ['rain', 'sun', 'weather', 'monsoon', 'temperature', 'humidity']
            },
            'irrigation_advice': {
                'ml': ['ജലം', 'നീര്', 'ജലസേചന', 'നനയ്ക്കൽ', 'ഡ്രിപ്', 'സ്പ്രിങ്ക്ലർ'],
                'en': ['water', 'irrigation', 'drip', 'sprinkler', 'flood', 'watering']
            }
        }
    
    def load_translator(self):
        """Load translation model for English-Malayalam"""
        try:
            self.translator = MBartForConditionalGeneration.from_pretrained("facebook/mbart-large-50-many-to-many-mmt")
            self.translate_tokenizer = MBart50TokenizerFast.from_pretrained("facebook/mbart-large-50-many-to-many-mmt")
            print("✅ Translation model loaded successfully")
        except Exception as e:
            print(f"❌ Translation model not available: {e}")
    
    def detect_language(self, text: str) -> str:
        """Detect if text is Malayalam or English"""
        # Check for Malayalam Unicode characters
        malayalam_range = re.compile(r'[\u0D00-\u0D7F]')
        if malayalam_range.search(text):
            return 'ml'
        else:
            return 'en'
    
    def translate_text(self, text: str, target_lang: str) -> str:
        """Translate text between English and Malayalam"""
        if not self.translator or target_lang not in ['en', 'ml']:
            return text
            
        lang_codes = {'en': 'en_XX', 'ml': 'ml_IN'}
        
        try:
            # Set source language based on target
            source_lang = "ml_IN" if target_lang == "en" else "en_XX"
            self.translate_tokenizer.src_lang = source_lang
            
            inputs = self.translate_tokenizer(text, return_tensors="pt", padding=True)
            
            generated_tokens = self.translator.generate(
                **inputs,
                forced_bos_token_id=self.translate_tokenizer.lang_code_to_id[lang_codes[target_lang]]
            )
            
            return self.translate_tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
        except Exception as e:
            print(f"Translation failed: {e}")
            return text
    
    def get_embeddings(self, text):
        if self.model is None:
            return np.random.rand(768)
            
        inputs = self.tokenizer(
            text, 
            return_tensors="pt", 
            padding=True, 
            truncation=True,
            max_length=512
        )
        with torch.no_grad():
            outputs = self.model(**inputs.to(self.device))
        return outputs.last_hidden_state.mean(dim=1).cpu().numpy()[0]
    
    def detect_intent(self, text: str) -> Tuple[str, float, str]:
        """Detect intent in both English and Malayalam"""
        language = self.detect_language(text)
        text_lower = text.lower()
        
        # Keyword-based matching
        intent_scores = {}
        
        for intent, keywords in self.intent_keywords.items():
            score = 0
            # Check keywords in the detected language
            for keyword in keywords[language]:
                if keyword.lower() in text_lower:
                    score += 2  # Higher weight for exact matches
            
            # Also check other language keywords with lower weight
            other_lang = 'en' if language == 'ml' else 'ml'
            for keyword in keywords[other_lang]:
                if keyword.lower() in text_lower:
                    score += 1  # Lower weight for cross-language matches
            
            intent_scores[intent] = score
        
        # Normalize scores and get best intent
        if max(intent_scores.values()) > 0:
            best_intent = max(intent_scores.items(), key=lambda x: x[1])
            confidence = min(0.9, best_intent[1] / 5.0)  # Normalize to 0-0.9
            return best_intent[0], max(0.5, confidence), language
        
        return 'general_advice', 0.5, language

# Test function
def test_multilingual_nlp():
    print("🧪 Testing Multilingual NLP...")
    nlp = MalayalamNLP()
    
    test_queries = [
        "എന്റെ നെല്ലിലെ ഇല പുള്ളി എങ്ങനെ ചികിത്സിക്കാം?",
        "What fertilizer for banana plants?",
        "How to control leaf spot disease in paddy?",
        "വാഴയ്ക്ക് എന്ത് വളം ഉപയോഗിക്കണം?"
    ]
    
    for query in test_queries:
        intent, confidence, language = nlp.detect_intent(query)
        print(f"\nQuery: {query}")
        print(f"Language: {language}")
        print(f"Intent: {intent} (confidence: {confidence:.2f})")

if __name__ == "__main__":
    test_multilingual_nlp()
