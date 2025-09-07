import chromadb
from chromadb.config import Settings
from typing import List, Dict, Any, Optional
import json
import os

class VectorStore:
    def __init__(self, persist_directory: str = "./data/embeddings"):
        self.persist_directory = persist_directory
        os.makedirs(persist_directory, exist_ok=True)
        
        # Initialize ChromaDB
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        # Create collection for agricultural knowledge
        self.collection = self.client.get_or_create_collection(
            name="krishi_knowledge",
            metadata={"hnsw:space": "cosine"}
        )
    
    def add_documents(self, documents: List[Dict[str, Any]], embeddings: List[List[float]]):
        """Add documents with embeddings to the vector store."""
        try:
            ids = [doc['id'] for doc in documents]
            contents = [doc['content'] for doc in documents]
            metadatas = [doc.get('metadata', {}) for doc in documents]
            
            # Add language and source info to metadata
            for i, doc in enumerate(documents):
                metadatas[i].update({
                    'language': doc.get('language', 'en'),
                    'source': doc.get('source', ''),
                    'chunk_index': doc.get('chunk_index', 0)
                })
            
            self.collection.add(
                embeddings=embeddings,
                documents=contents,
                metadatas=metadatas,
                ids=ids
            )
            
            return True
            
        except Exception as e:
            print(f"Error adding documents to vector store: {str(e)}")
            return False
    
    def search(self, query_embedding: List[float], n_results: int = 5, 
               language_filter: Optional[str] = None) -> Dict[str, Any]:
        """Search for similar documents."""
        try:
            where_clause = {}
            if language_filter:
                where_clause["language"] = language_filter
            
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where=where_clause if where_clause else None,
                include=['documents', 'metadatas', 'distances']
            )
            
            return {
                'documents': results['documents'][0],
                'metadatas': results['metadatas'][0],
                'distances': results['distances'][0]
            }
            
        except Exception as e:
            print(f"Error searching vector store: {str(e)}")
            return {'documents': [], 'metadatas': [], 'distances': []}
    
    def update_document(self, doc_id: str, content: str, embedding: List[float], metadata: Dict[str, Any]):
        """Update an existing document."""
        try:
            self.collection.update(
                ids=[doc_id],
                embeddings=[embedding],
                documents=[content],
                metadatas=[metadata]
            )
            return True
        except Exception as e:
            print(f"Error updating document: {str(e)}")
            return False
    
    def delete_document(self, doc_id: str):
        """Delete a document by ID."""
        try:
            self.collection.delete(ids=[doc_id])
            return True
        except Exception as e:
            print(f"Error deleting document: {str(e)}")
            return False
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """Get statistics about the collection."""
        try:
            count = self.collection.count()
            return {
                'total_documents': count,
                'collection_name': self.collection.name
            }
        except Exception as e:
            print(f"Error getting collection stats: {str(e)}")
            return {'total_documents': 0, 'collection_name': ''}
