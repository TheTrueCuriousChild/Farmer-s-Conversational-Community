from models.nlp_model.malayalam_processor import MalayalamNLP
from retrieval.vector_store import AgriculturalKnowledgeBase
from datetime import datetime
from typing import Dict, Any

class RAGQueryProcessor:
    def __init__(self):
        self.nlp_processor = MalayalamNLP()
        self.knowledge_base = AgriculturalKnowledgeBase()
        self.conversation_context = {}
    
    def process_query(self, query: Dict[str, Any]) -> Dict[str, Any]:
        """Process query with RAG enhancement"""
        if 'text' not in query:
            return {'error': 'Text query required'}
        
        text = query['text']
        farmer_id = query.get('farmer_id', 'anonymous')
        
        # Detect language, intent, and confidence
        intent, confidence, language = self.nlp_processor.detect_intent(text)
        
        # Retrieve relevant knowledge
        knowledge_results = self.knowledge_base.search_knowledge(text, intent, top_k=2)
        
        # Generate enhanced response
        response = self.generate_enhanced_response(intent, text, knowledge_results, language)
        
        # Update context
        self.update_context(farmer_id, text, intent)
        
        return {
            'intent': intent,
            'confidence': float(confidence),
            'language': language,
            'knowledge_results': knowledge_results,
            'response': response,
            'timestamp': datetime.now().isoformat()
        }
    
    def generate_enhanced_response(self, intent: str, query: str, knowledge: list, language: str) -> Dict:
        """Generate response enhanced with retrieved knowledge"""
        # Base responses in both languages
        base_responses = {
            'pest_control': {
                'en': 'I can help with pest and disease control.',
                'ml': 'എനിക്ക് കീടനിയന്ത്രണത്തിൽ സഹായിക്കാനാകും.'
            },
            'fertilizer_advice': {
                'en': 'I can provide fertilizer recommendations.',
                'ml': 'എനിക്ക് വളപ്രബന്ധം സഹായിക്കാനാകും.'
            },
            'weather_query': {
                'en': 'I can check weather information.',
                'ml': 'എനിക്ക് കാലാവസ്ഥാ വിവരം സഹായിക്കാനാകും.'
            },
            'irrigation_advice': {
                'en': 'I can advise on irrigation practices.',
                'ml': 'എനിക്ക് ജലസേചനത്തിൽ സഹായിക്കാനാകും.'
            },
            'general_advice': {
                'en': 'I understand you need agricultural advice.',
                'ml': 'കൃഷി സംബന്ധിച്ച സഹായം ആവശ്യമായി തോന്നുന്നു.'
            }
        }
        
        # Get base response
        response_text = base_responses.get(intent, base_responses['general_advice']).get(
            language, base_responses['general_advice']['en']
        )
        
        # Add knowledge if available and relevant
        if knowledge and knowledge[0]['similarity'] > 0.3:
            best_knowledge = knowledge[0]
            if language == 'ml':
                # Translate knowledge to Malayalam
                knowledge_text = self.nlp_processor.translate_text(best_knowledge['text'], 'ml')
            else:
                knowledge_text = best_knowledge['text']
            
            response_text += f"\n\n{knowledge_text}"
        
        # Follow-up questions
        follow_ups = {
            'pest_control': {
                'en': 'Can you share a photo of the affected leaves?',
                'ml': 'ബാധിച്ച ഇലകളുടെ ഫോട്ടോ പങ്കിടാമോ?'
            },
            'fertilizer_advice': {
                'en': 'What is your soil type? (clay, sandy, loamy)',
                'ml': 'നിങ്ങളുടെ മണ്ണിനം എന്താണ്? (എക്കൽ, വെണ്ണക്കല്ല്, ചെങ്കൽ)'
            },
            'weather_query': {
                'en': 'Which district in Kerala are you from?',
                'ml': 'കേരളത്തിലെ ഏത് ജില്ലയിലാണ് നിങ്ങൾ?'
            }
        }
        
        follow_up = follow_ups.get(intent, {}).get(language, '')
        
        return {
            'response': response_text,
            'follow_up': follow_up,
            'knowledge_used': len(knowledge) > 0 and knowledge[0]['similarity'] > 0.3
        }
    
    def update_context(self, farmer_id: str, query: str, intent: str):
        """Update conversation context"""
        if farmer_id not in self.conversation_context:
            self.conversation_context[farmer_id] = {
                'history': [],
                'last_intent': None,
                'mentioned_crops': set()
            }
        
        context = self.conversation_context[farmer_id]
        context['history'].append({
            'query': query,
            'intent': intent,
            'timestamp': datetime.now().isoformat()
        })
        
        # Keep only last 5 messages
        if len(context['history']) > 5:
            context['history'] = context['history'][-5:]

# Test the RAG processor
def test_rag_processor():
    print("🧪 Testing RAG Query Processor...")
    processor = RAGQueryProcessor()
    
    test_queries = [
        {"text": "How to treat leaf spot in paddy?", "farmer_id": "test1"},
        {"text": "What fertilizer for banana plants?", "farmer_id": "test2"},
        {"text": "എന്റെ നെല്ലിലെ ഇല പുള്ളി എങ്ങനെ ചികിത്സിക്കാം?", "farmer_id": "test3"}
    ]
    
    for query in test_queries:
        result = processor.process_query(query)
        print(f"\nQuery: {query['text']}")
        print(f"Language: {result['language']}")
        print(f"Intent: {result['intent']} ({result['confidence']:.2f})")
        print(f"Response: {result['response']['response']}")
        if result['response']['knowledge_used']:
            print(f"💡 Knowledge-based answer!")

if __name__ == "__main__":
    test_rag_processor()
