from inference.rag_processor import RAGQueryProcessor

def main():
    print("🌾 AI Farmer Advisory System - Multilingual + RAG")
    print("=" * 60)
    
    # Initialize the RAG system
    processor = RAGQueryProcessor()
    
    # Demo queries in both English and Malayalam
    demo_queries = [
        "How to treat leaf spot in paddy?",
        "What fertilizer for banana plants?",
        "How to control tomato leaf curl?",
        "എന്റെ നെല്ലിലെ ഇല പുള്ളി എങ്ങനെ ചികിത്സിക്കാം?",
        "വാഴയ്ക്ക് എന്ത് വളം ഉപയോഗിക്കണം?",
        "തക്കാളിയിലെ ഇലത്തുമ്പ് എങ്ങനെ നിയന്ത്രിക്കാം?"
    ]
    
    print("\n🧪 Testing with multilingual queries + RAG:")
    print("-" * 50)
    
    for i, query_text in enumerate(demo_queries, 1):
        print(f"\n{i}. Query: {query_text}")
        result = processor.process_query({"text": query_text})
        
        print(f"   Language: {result['language'].upper()}")
        print(f"   Intent: {result['intent']} ({result['confidence']:.2f} confidence)")
        print(f"   Response: {result['response']['response']}")
        
        if result['response']['follow_up']:
            print(f"   Follow-up: {result['response']['follow_up']}")
        
        if result['response']['knowledge_used']:
            print(f"   💡 Knowledge-based answer!")

if __name__ == "__main__":
    main()
