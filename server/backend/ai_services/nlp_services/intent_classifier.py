from typing import Dict, List, Any, Tuple
import re
import google.generativeai as genai

class IntentClassifier:
    def __init__(self, gemini_api_key: str):
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        
        # Predefined intent patterns
        self.intent_patterns = {
            'crop_disease_identification': [
                r'\b(disease|infected|spots|yellowing|wilting|രോഗം|രോഗബാധിത)\b',
                r'\b(leaf|leaves|stem|root|fruit|ഇല|തണ്ട്|വേര്|ഫലം)\b'
            ],
            'pest_management': [
                r'\b(pest|insect|bug|caterpillar|aphid|കീടം|പുഴു)\b',
                r'\b(control|management|spray|treatment|നിയന്ത്രണം|ചികിത്സ)\b'
            ],
            'crop_cultivation': [
                r'\b(grow|plant|cultivation|farming|കൃഷി|നട്ട്|വളർത്തൽ)\b',
                r'\b(season|time|when|എപ്പോൾ|സമയം|കാലം)\b'
            ],
            'fertilizer_advice': [
                r'\b(fertilizer|manure|nutrients|urea|phosphate|വളം|പോഷകങ്ങൾ)\b',
                r'\b(apply|use|dose|quantity|ഉപയോഗം|അളവ്)\b'
            ],
            'weather_related': [
                r'\b(weather|rain|drought|humidity|temperature|മഴ|വെയില്|കാലാവസ്ഥ)\b',
                r'\b(forecast|prediction|ഭാവിപ്രവചനം)\b'
            ],
            'market_prices': [
                r'\b(price|cost|market|sell|buy|വില|ചന്ത|വിൽക്കാൻ)\b',
                r'\b(rate|rates|വിലനിര്ണയം)\b'
            ],
            'government_schemes': [
                r'\b(scheme|subsidy|government|support|സ്കീം|സബ്സിഡി|സർക്കാർ)\b',
                r'\b(apply|eligible|eligibility|അപേക്ষ|യോഗ്യത)\b'
            ],
            'general_query': [
                r'\b(what|how|when|where|why|কি|কীভাবে|কখন|কোথায়)\b'
            ]
        }
        
        self.confidence_threshold = 0.3
    
    def classify_intent_rule_based(self, text: str) -> Dict[str, Any]:
        """Classify intent using rule-based approach."""
        text_lower = text.lower()
        intent_scores = {}
        
        for intent, patterns in self.intent_patterns.items():
            score = 0
            matched_patterns = []
            
            for pattern in patterns:
                matches = re.findall(pattern, text_lower, re.IGNORECASE)
                if matches:
                    score += len(matches) * 0.2
                    matched_patterns.extend(matches)
            
            if score > 0:
                intent_scores[intent] = {
                    'score': min(score, 1.0),  # Cap at 1.0
                    'matched_patterns': list(set(matched_patterns))
                }
        
        # Sort by score
        sorted_intents = sorted(intent_scores.items(), key=lambda x: x[1]['score'], reverse=True)
        
        if sorted_intents and sorted_intents[0][1]['score'] >= self.confidence_threshold:
            return {
                'primary_intent': sorted_intents[0][0],
                'confidence': sorted_intents[0][1]['score'],
                'all_intents': dict(sorted_intents),
                'method': 'rule_based'
            }
        else:
            return {
                'primary_intent': 'general_query',
                'confidence': 0.1,
                'all_intents': intent_scores,
                'method': 'rule_based'
            }
    
    async def classify_intent_llm(self, text: str, language: str = 'en') -> Dict[str, Any]:
        """Classify intent using Gemini LLM."""
        try:
            intent_prompt = f"""
            Analyze the following agricultural query and classify its intent.
            
            Query: {text}
            Language: {language}
            
            Classify into one of these categories:
            1. crop_disease_identification - identifying plant diseases
            2. pest_management - dealing with pests and insects
            3. crop_cultivation - growing and farming advice
            4. fertilizer_advice - fertilizer and nutrient guidance
            5. weather_related - weather and climate queries
            6. market_prices - pricing and market information
            7. government_schemes - subsidies and government programs
            8. general_query - general agricultural questions
            
            Provide your response in this exact format:
            Intent: [category]
            Confidence: [0.0-1.0]
            Reasoning: [brief explanation]
            """
            
            response = self.model.generate_content(intent_prompt)
            response_text = response.text.strip()
            
            # Parse response
            intent_match = re.search(r'Intent:\s*(\w+)', response_text, re.IGNORECASE)
            confidence_match = re.search(r'Confidence:\s*([\d.]+)', response_text, re.IGNORECASE)
            reasoning_match = re.search(r'Reasoning:\s*(.+)', response_text, re.IGNORECASE | re.DOTALL)
            
            intent = intent_match.group(1) if intent_match else 'general_query'
            confidence = float(confidence_match.group(1)) if confidence_match else 0.5
            reasoning = reasoning_match.group(1).strip() if reasoning_match else 'LLM classification'
            
            return {
                'primary_intent': intent,
                'confidence': min(confidence, 1.0),
                'reasoning': reasoning,
                'method': 'llm'
            }
            
        except Exception as e:
            print(f"LLM intent classification error: {str(e)}")
            return self.classify_intent_rule_based(text)
    
    async def classify_intent_hybrid(self, text: str, language: str = 'en') -> Dict[str, Any]:
        """Hybrid approach combining rule-based and LLM classification."""
        # Get both classifications
        rule_based = self.classify_intent_rule_based(text)
        llm_based = await self.classify_intent_llm(text, language)
        
        # If rule-based has high confidence, use it
        if rule_based['confidence'] >= 0.7:
            return {
                **rule_based,
                'method': 'hybrid_rule_dominant',
                'llm_suggestion': llm_based['primary_intent']
            }
        
        # If LLM has high confidence and rule-based is low, use LLM
        if llm_based['confidence'] >= 0.7 and rule_based['confidence'] < 0.5:
            return {
                **llm_based,
                'method': 'hybrid_llm_dominant',
                'rule_suggestion': rule_based['primary_intent']
            }
        
        # If both agree, high confidence
        if rule_based['primary_intent'] == llm_based['primary_intent']:
            return {
                'primary_intent': rule_based['primary_intent'],
                'confidence': min((rule_based['confidence'] + llm_based['confidence']) / 2 + 0.2, 1.0),
                'method': 'hybrid_agreement',
                'rule_based': rule_based,
                'llm_based': llm_based
            }
        
        # Use the one with higher confidence
        if rule_based['confidence'] >= llm_based['confidence']:
            return {
                **rule_based,
                'method': 'hybrid_rule_selected',
                'alternative': llm_based
            }
        else:
            return {
                **llm_based,
                'method': 'hybrid_llm_selected',
                'alternative': rule_based
            }