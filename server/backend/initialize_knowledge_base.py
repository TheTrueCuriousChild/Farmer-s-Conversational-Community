# server/initialize_knowledge_base.py
import asyncio
import os
from ai_services.rag_pipeline.document_processor import DocumentProcessor
from ai_services.rag_pipeline.embeddings_manager import EmbeddingsManager
from ai_services.rag_pipeline.vector_store import VectorStore

async def initialize_knowledge_base():
    # Initialize components
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    processor = DocumentProcessor(gemini_api_key)
    embeddings_manager = EmbeddingsManager(gemini_api_key)
    vector_store = VectorStore()
    
    # Process all documents in knowledge base
    kb_path = "./data/knowledge_base"
    for category in os.listdir(kb_path):
        category_path = os.path.join(kb_path, category)
        if os.path.isdir(category_path):
            for filename in os.listdir(category_path):
                file_path = os.path.join(category_path, filename)
                if filename.endswith('.txt'):
                    print(f"Processing {file_path}...")
                    
                    # Process document
                    documents = processor.process_agricultural_document(file_path)
                    
                    if documents:
                        # Generate embeddings
                        contents = [doc['content'] for doc in documents]
                        embeddings = await embeddings_manager.generate_batch_embeddings(contents)
                        
                        # Store in vector database
                        vector_store.add_documents(documents, embeddings)
                        print(f"Added {len(documents)} chunks from {filename}")

if __name__ == "__main__":
    asyncio.run(initialize_knowledge_base())