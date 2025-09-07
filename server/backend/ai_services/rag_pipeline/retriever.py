from typing import List, Dict, Any, Optional
import asyncio
from .embeddings_manager import EmbeddingsManager
from .vector_store import VectorStore

class DocumentRetriever:
    def __init__(self, embeddings_manager: EmbeddingsManager, vector_store: VectorStore):
        self.embeddings_manager = embeddings_manager
        self.vector_store = vector_store
        
    async def retrieve_relevant_documents(self, query: str, language: str = 'en', 
                                        top_k: int = 5, similarity_threshold: float = 0.7) -> List[Dict[str, Any]]:
        """Retrieve relevant documents for a given query."""
        try:
            # Generate query embedding
            query_embedding = await self.embeddings_manager.generate_embedding(query)
            
            # Search vector store
            search_results = self.vector_store.search(
                query_embedding=query_embedding,
                n_results=top_k * 2,  # Get more results to filter
                language_filter=language
            )
            
            # Filter by similarity threshold
            relevant_docs = []
            for i, (doc, metadata, distance) in enumerate(zip(
                search_results['documents'],
                search_results['metadatas'],
                search_results['distances']
            )):
                # Convert distance to similarity (ChromaDB uses cosine distance)
                similarity = 1 - distance
                
                if similarity >= similarity_threshold:
                    relevant_docs.append({
                        'content': doc,
                        'metadata': metadata,
                        'similarity': similarity,
                        'rank': i + 1
                    })
            
            # Sort by similarity and limit to top_k
            relevant_docs.sort(key=lambda x: x['similarity'], reverse=True)
            return relevant_docs[:top_k]
            
        except Exception as e:
            print(f"Error retrieving documents: {str(e)}")
            return []
    
    async def retrieve_by_category(self, query: str, category: str, language: str = 'en', top_k: int = 3) -> List[Dict[str, Any]]:
        """Retrieve documents filtered by category (crops, diseases, pesticides, etc.)."""
        try:
            query_embedding = await self.embeddings_manager.generate_embedding(query)
            
            # Search with category filter
            search_results = self.vector_store.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where={
                    "$and": [
                        {"language": language},
                        {"source": {"$regex": f".*{category}.*"}}
                    ]
                },
                include=['documents', 'metadatas', 'distances']
            )
            
            relevant_docs = []
            for i, (doc, metadata, distance) in enumerate(zip(
                search_results['documents'][0],
                search_results['metadatas'][0],
                search_results['distances'][0]
            )):
                similarity = 1 - distance
                relevant_docs.append({
                    'content': doc,
                    'metadata': metadata,
                    'similarity': similarity,
                    'category': category
                })
            
            return relevant_docs
            
        except Exception as e:
            print(f"Error retrieving documents by category: {str(e)}")
            return []
    
    def format_context(self, documents: List[Dict[str, Any]]) -> str:
        """Format retrieved documents into a context string for the LLM."""
        if not documents:
            return "No relevant information found."
        
        context_parts = []
        for i, doc in enumerate(documents, 1):
            content = doc['content']
            source = doc['metadata'].get('file_name', 'Unknown')
            similarity = doc['similarity']
            
            context_part = f"[Source {i}: {source} (Relevance: {similarity:.2f})]\n{content}\n"
            context_parts.append(context_part)
        
        return "\n---\n".join(context_parts)