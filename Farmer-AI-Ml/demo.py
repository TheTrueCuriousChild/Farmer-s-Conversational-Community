# demo.py - Main demo script
from inference.query_processor import FarmerQueryProcessor

def main():
    print("🌾 AI Farmer Advisory System - Demo")
    print("=" * 50)
    
    # Initialize the system
    processor = FarmerQueryProcessor()
    
    # Demo queries
    demo_queries = [
        "എന്റെ നെല്ലിലെ ഇല പുള്ളി എങ്ങനെ ചികിത്സിക്കാം?",
        "വാഴയ്ക്ക് എന്ത് വളം ഉപയോഗിക്കണം?",
        "ഇന്ന് മഴ ഉണ്ടാകുമോ?",
        "തക്കാളിയിലെ ഇലത്തുമ്പ് എങ്ങനെ നിയന്ത്രിക്കാം?"
    ]
    
    print("\n🧪 Testing with demo queries:")
    print("-" * 30)
    
    for i, query_text in enumerate(demo_queries, 1):
        print(f"\n{i}. Query: {query_text}")
        result = processor.process_query({"text": query_text})
        print(f"   Intent: {result['intent']}")
        print(f"   Response: {result['response']}")
        print(f"   Confidence: {result['confidence']:.2f}")

if __name__ == "__main__":
    main()
