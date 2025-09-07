import google.generativeai as genai
import numpy as np
from typing import List, Dict, Any
import asyncio
import aiohttp

class EmbeddingsManager:
    def __init__(self, gemini_api_key: str):
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embeddings using Gemini API."""
        try:
            # Use Gemini's embedding endpoint
            embedding_model = 'models/embedding-001'
            
            result = genai.embed_content(
                model=embedding_model,
                content=text,
                task_type="retrieval_document"
            )
            
            return result['embedding']
            
        except Exception as e:
            print(f"Error generating embedding: {str(e)}")
            # Fallback to simple TF-IDF style embedding
            return self._fallback_embedding(text)
    
    def _fallback_embedding(self, text: str, dim: int = 768) -> List[float]:
        """Simple fallback embedding using hash-based approach."""
        words = text.lower().split()
        embedding = np.zeros(dim)
        
        for word in words:
            word_hash = hash(word) % dim
            embedding[word_hash] += 1.0
        
        # Normalize
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
        
        return embedding.tolist()
    
    async def generate_batch_embeddings(self, texts: List[str], batch_size: int = 10) -> List[List[float]]:
        """Generate embeddings for multiple texts in batches."""
        embeddings = []
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            batch_embeddings = []
            
            for text in batch:
                embedding = await self.generate_embedding(text)
                batch_embeddings.append(embedding)
            
            embeddings.extend(batch_embeddings)
            
            # Add delay to respect rate limits
            await asyncio.sleep(0.1)
        
        return embeddings