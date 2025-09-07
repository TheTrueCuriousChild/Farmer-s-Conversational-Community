import chromadb
from chromadb.config import Settings
import numpy as np
from typing import List, Dict
import re

class AgriculturalKnowledgeBase:
    def __init__(self):
        # Initialize ChromaDB client with new API
        try:
            # Try new API first
            self.client = chromadb.PersistentClient(path="./.chromadb")
        except:
            # Fallback to old API
            self.client = chromadb.Client(Settings(
                chroma_db_impl="duckdb+parquet",
                persist_directory="./.chromadb"
            ))
        
        # Create or get collection
        self.collection = self.client.get_or_create_collection(
            name="agricultural_knowledge",
            metadata={"hnsw:space": "cosine"}
        )
        
        self._initialize_knowledge_base()
        print("✅ Agricultural knowledge base loaded with ChromaDB vector store")
    
    def _initialize_knowledge_base(self):
        """Initialize with agricultural knowledge"""
        knowledge_items = [
            {
                "text": "Leaf spot in paddy can be treated with Tricyclazole or Isoprothiolane fungicides. Apply at first sign of disease.",
                "category": "pest_control",
                "crop": "paddy",
                "keywords": "leaf spot paddy fungicide tricyclazole isoprothiolane"
            },
            {
                "text": "Banana plants require NPK 12:32:16 fertilizer during growth stage. Apply 500g per plant every 3 months.",
                "category": "fertilizer_advice", 
                "crop": "banana",
                "keywords": "banana fertilizer npk 12:32:16 growth stage"
            },
            {
                "text": "Tomato leaf curl virus can be controlled by using resistant varieties and neem oil spray. Remove infected plants.",
                "category": "pest_control",
                "crop": "tomato",
                "keywords": "tomato leaf curl neem oil resistant varieties virus"
            },
            {
                "text": "Paddy requires 2-3 cm water depth during vegetative stage. Maintain proper water management for good yield.",
                "category": "irrigation_advice",
                "crop": "paddy",
                "keywords": "paddy water irrigation vegetative stage water depth"
            },
            {
                "text": "Rice blast disease can be controlled with fungicides like Tricyclazole. Use resistant varieties for prevention.",
                "category": "pest_control",
                "crop": "paddy",
                "keywords": "rice blast paddy fungicide tricyclazole resistant"
            },
            {
                "text": "For banana plants, use organic manure like compost along with chemical fertilizers for better soil health.",
                "category": "fertilizer_advice",
                "crop": "banana",
                "keywords": "banana organic compost manure soil health"
            }
        ]
        
        # Check if collection is empty before adding
        existing_count = self.collection.count()
        if existing_count == 0:
            print("📝 Adding knowledge items to vector store...")
            
            documents = []
            metadatas = []
            ids = []
            
            for i, item in enumerate(knowledge_items):
                # Combine text and keywords for better embedding
                document_text = f"{item['text']} {item['keywords']}"
                documents.append(document_text)
                metadatas.append({
                    "category": item["category"],
                    "crop": item["crop"],
                    "original_text": item["text"]
                })
                ids.append(f"knowledge_{i}")
            
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            print(f"✅ Added {len(knowledge_items)} knowledge items")
        else:
            print(f"📊 Using existing knowledge base with {existing_count} items")
    
    def search_knowledge(self, query: str, category: str = None, top_k: int = 3) -> List[Dict]:
        """Search agricultural knowledge base using vector similarity"""
        try:
            # Query the collection
            results = self.collection.query(
                query_texts=[query],
                n_results=top_k * 2,  # Get extra for filtering
                include=["metadatas", "distances"]
            )
            
            filtered_results = []
            if results["metadatas"] and results["distances"]:
                for i, (metadata, distance) in enumerate(zip(results["metadatas"][0], results["distances"][0])):
                    # Filter by category if specified
                    if category and metadata["category"] != category:
                        continue
                    
                    # Convert distance to similarity (cosine distance → similarity)
                    similarity = 1 - distance
                    
                    result = {
                        "text": metadata["original_text"],
                        "category": metadata["category"],
                        "crop": metadata["crop"],
                        "similarity": float(similarity),
                        "distance": float(distance)
                    }
                    
                    filtered_results.append(result)
                    
                    if len(filtered_results) >= top_k:
                        break
            
            return sorted(filtered_results, key=lambda x: x["similarity"], reverse=True)
            
        except Exception as e:
            print(f"Vector search error: {e}")
            return self._fallback_keyword_search(query, category, top_k)
    
    def _fallback_keyword_search(self, query: str, category: str = None, top_k: int = 3) -> List[Dict]:
        """Fallback to keyword search if vector search fails"""
        query_lower = query.lower()
        results = []
        
        # Simple keyword matching fallback
        knowledge_items = [
            {
                "text": "Leaf spot in paddy can be treated with Tricyclazole or Isoprothiolane fungicides.",
                "category": "pest_control",
                "crop": "paddy"
            },
            {
                "text": "Banana plants require NPK 12:32:16 fertilizer during growth stage.",
                "category": "fertilizer_advice", 
                "crop": "banana"
            },
            {
                "text": "Tomato leaf curl virus can be controlled by using resistant varieties and neem oil spray.",
                "category": "pest_control",
                "crop": "tomato"
            },
            {
                "text": "Paddy requires 2-3 cm water depth during vegetative stage.",
                "category": "irrigation_advice",
                "crop": "paddy"
            }
        ]
        
        for item in knowledge_items:
            if category and item["category"] != category:
                continue
            
            # Simple keyword matching
            score = 0
            if item["crop"] in query_lower:
                score += 2
            if any(keyword in query_lower for keyword in ["leaf spot", "fungicide", "treatment", "control"]):
                score += 1
            if any(keyword in query_lower for keyword in ["fertilizer", "npk", "manure", "compost"]):
                score += 1
            if any(keyword in query_lower for keyword in ["water", "irrigation", "depth"]):
                score += 1
            
            if score > 0:
                result = item.copy()
                result["similarity"] = min(0.8, score / 5.0)
                results.append(result)
        
        return sorted(results, key=lambda x: x["similarity"], reverse=True)[:top_k]
    
    def add_knowledge(self, text: str, category: str, crop: str, keywords: str = ""):
        """Add new knowledge to the database"""
        # Get current count for ID
        count = self.collection.count()
        
        document_text = f"{text} {keywords}"
        metadata = {
            "category": category,
            "crop": crop,
            "original_text": text
        }
        
        self.collection.add(
            documents=[document_text],
            metadatas=[metadata],
            ids=[f"knowledge_{count}"]
        )

# Test the ChromaDB knowledge base
def test_knowledge_base():
    print("🧪 Testing ChromaDB Agricultural Knowledge Base...")
    kb = AgriculturalKnowledgeBase()
    
    test_queries = [
        "How to treat leaf spot in paddy?",
        "What fertilizer for banana?",
        "Tomato leaf curl control",
        "Water requirements for paddy",
        "Rice blast disease treatment"
    ]
    
    for query in test_queries:
        results = kb.search_knowledge(query)
        print(f"\nQuery: {query}")
        if results:
            for i, result in enumerate(results, 1):
                print(f"{i}. {result['text']}")
                print(f"   Similarity: {result['similarity']:.2f}, Category: {result['category']}")
        else:
            print("   No matching knowledge found")

if __name__ == "__main__":
    test_knowledge_base()
