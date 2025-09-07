# inference/query_processor.py
from models.nlp_model.malayalam_processor import MalayalamNLP
from datetime import datetime

class FarmerQueryProcessor:
    def __init__(self):
        self.nlp_processor = MalayalamNLP()
        self.conversation_context = {}
    
    def process_query(self, query):
        print(f"📨 Processing query: {query}")
        
        if 'text' in query:
            return self.process_text_query(query)
        else:
            return {'error': 'Only text queries supported in demo'}
    
    def process_text_query(self, query):
        malayalam_text = query['text']
        farmer_id = query.get('farmer_id', 'demo_user')
        
        # Detect intent
        intent, confidence = self.nlp_processor.detect_intent(malayalam_text)
        
        # Generate response
        response = self.generate_response(intent, malayalam_text)
        
        return {
            'intent': intent,
            'confidence': float(confidence),
            'response': response,
            'timestamp': datetime.now().isoformat()
        }
    
    def generate_response(self, intent, text):
    # More specific responses based on intent
        responses = {
            'pest_control': {
                'response': 'I can help with pest and disease control. Please tell me which crop is affected and describe the symptoms.',
                'follow_up': 'Can you share a photo of the affected leaves?'
            },
            'fertilizer_advice': {
                'response': 'I can provide fertilizer recommendations. Please specify the crop name and growth stage.',
                'follow_up': 'What is your soil type? (clay, sandy, loamy)'
            },
            'weather_query': {
                'response': 'I can check weather information. Please specify your district or location in Kerala.',
                'follow_up': 'Which time period are you interested in? (today, tomorrow, this week)'
            },
            'irrigation_advice': {
                'response': 'I can advise on irrigation practices. Please specify the crop and current growth stage.',
                'follow_up': 'What is your water source? (well, canal, rain-fed)'
            },
            'general_advice': {
                'response': 'I understand you need agricultural advice. Can you please provide more details about your query?',
                'follow_up': 'Which crop are you asking about?'
            }
        }
        
        return responses.get(intent, responses['general_advice'])

# Test function
def test_query_processor():
    print("🧪 Testing Query Processor...")
    processor = FarmerQueryProcessor()
    
    test_queries = [
        {"text": "എന്റെ നെല്ലിലെ ഇല പുള്ളി എങ്ങനെ ചികിത്സിക്കാം?", "farmer_id": "test1"},
        {"text": "വാഴയ്ക്ക് എന്ത് വളം ഉപയോഗിക്കണം?", "farmer_id": "test2"},
        {"text": "ഇന്ന് മഴ ഉണ്ടാകുമോ?", "farmer_id": "test3"}
    ]
    
    for query in test_queries:
        result = processor.process_query(query)
        print(f"\n✅ Result: {result}")

if __name__ == "__main__":
    test_query_processor()
