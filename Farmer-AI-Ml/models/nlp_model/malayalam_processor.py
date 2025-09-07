import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel
import numpy as np
import re

class MalayalamNLP:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {self.device}")
        
        try:
            self.tokenizer = AutoTokenizer.from_pretrained("ai4bharat/indic-bert")
            self.model = AutoModel.from_pretrained("ai4bharat/indic-bert").to(self.device)
            print("✅ Malayalam NLP model loaded successfully")
        except Exception as e:
            print(f"❌ Failed to load model: {e}")
            self.model = None
        
        # Agricultural keywords for intent detection - SIMPLIFIED
        self.intent_keywords = {
            'pest_control': ['പുള്ളി', 'രോഗ', 'കീട', 'തുമ്പ്', 'ചികിത്സ', 'മരുന്ന്', 'പുഴു'],
            'fertilizer_advice': ['വളം', 'ഉരുള', 'manure', 'fertilizer', 'ജൈവവളം', 'രാസവളം'],
            'weather_query': ['മഴ', 'വെയില', 'കാലാവസ്ഥ', 'weather', 'മഞ്ഞ്', 'ആർദ്രത'],
            'irrigation_advice': ['ജലം', 'നീര്', 'irrigation', 'ജലസേചന', 'നനയ്ക്കൽ'],
            'crop_advice': ['വിള', 'കൃഷി', 'crop', 'വിത്ത്', 'seed', 'കായ്', 'പഴം']
        }
    
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
    
    def detect_intent(self, text):
        """Improved intent detection with better keyword matching"""
        # First, try keyword-based matching
        keyword_intent = self._detect_intent_by_keywords(text)
        
        if keyword_intent[1] > 0.3:  # Lower threshold for better detection
            return keyword_intent
        
        # If no strong keyword match, use pattern matching
        pattern_intent = self._detect_intent_by_patterns(text)
        if pattern_intent[1] > 0.4:
            return pattern_intent
        
        return 'general_advice', 0.5
    
    def _detect_intent_by_keywords(self, text):
        """Detect intent based on keyword presence with better matching"""
        text_lower = text.lower()
        intent_scores = {}
        
        for intent, keywords in self.intent_keywords.items():
            score = 0
            for keyword in keywords:
                # Check if keyword exists in text (simple substring match)
                if keyword in text_lower:
                    score += 2  # Higher weight for exact matches
                # Also check for partial matches for longer words
                elif any(keyword in word for word in text_lower.split()):
                    score += 1
            intent_scores[intent] = score
        
        # Normalize scores and get best intent
        if max(intent_scores.values()) > 0:
            best_intent = max(intent_scores.items(), key=lambda x: x[1])
            confidence = min(0.9, best_intent[1] / 5.0)  # Normalize to 0-0.9
            return best_intent[0], max(0.5, confidence)
        
        return 'general_advice', 0.3
    
    def _detect_intent_by_patterns(self, text):
        """Detect intent based on common patterns in agricultural queries"""
        text_lower = text.lower()
        
        # Pest control patterns
        pest_patterns = [
            r'.*പുള്ളി.*', r'.*രോഗ.*', r'.*കീട.*', r'.*തുമ്പ്.*', 
            r'.*ചികിത്സ.*', r'.*മരുന്ന്.*', r'.*പുഴു.*', r'.*അണുബാധ.*'
        ]
        
        # Fertilizer patterns  
        fertilizer_patterns = [
            r'.*വളം.*', r'.*ഉരുള.*', r'.*manure.*', r'.*fertilizer.*',
            r'.*ജൈവ.*', r'.*രാസ.*', r'.*npk.*', r'.*യൂറിയ.*'
        ]
        
        # Weather patterns
        weather_patterns = [
            r'.*മഴ.*', r'.*വെയില.*', r'.*കാലാവസ്ഥ.*', r'.*weather.*',
            r'.*മഞ്ഞ്.*', r'.*ആർദ്രത.*', r'.*താപനില.*'
        ]
        
        # Check patterns
        for pattern in pest_patterns:
            if re.search(pattern, text_lower):
                return 'pest_control', 0.7
                
        for pattern in fertilizer_patterns:
            if re.search(pattern, text_lower):
                return 'fertilizer_advice', 0.7
                
        for pattern in weather_patterns:
            if re.search(pattern, text_lower):
                return 'weather_query', 0.7
        
        return 'general_advice', 0.4

# Test function with more detailed output
def test_nlp():
    print("🧪 Testing Enhanced Malayalam NLP...")
    nlp = MalayalamNLP()
    
    test_queries = [
        "എന്റെ നെല്ലിലെ ഇല പുള്ളി എങ്ങനെ ചികിത്സിക്കാം?",
        "വാഴയ്ക്ക് എന്ത് വളം ഉപയോഗിക്കണം?",
        "ഇന്ന് മഴ ഉണ്ടാകുമോ?",
        "തക്കാളിയിലെ ഇലത്തുമ്പ് എങ്ങനെ നിയന്ത്രിക്കാം?",
        "നെല്ലിന് എത്ര ജലം ആവശ്യമാണ്?",
        "മത്തൻ കൃഷി ചെയ്യുന്നത് എങ്ങനെ?",
        "ജൈവ വളം ഉണ്ടാക്കുന്ന വിധം?"
    ]
    
    print("Testing queries with keyword analysis:")
    print("=" * 60)
    
    for query in test_queries:
        print(f"\nQuery: {query}")
        
        # Test keyword matching
        nlp_test = MalayalamNLP()
        keyword_result = nlp_test._detect_intent_by_keywords(query)
        pattern_result = nlp_test._detect_intent_by_patterns(query)
        final_result = nlp_test.detect_intent(query)
        
        print(f"  Keyword detection: {keyword_result}")
        print(f"  Pattern detection: {pattern_result}")
        print(f"  Final intent: {final_result}")

if __name__ == "__main__":
    test_nlp()
