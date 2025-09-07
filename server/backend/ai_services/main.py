# server/ai_services/main.py - FastAPI Application
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import asyncio
from dotenv import load_dotenv

# Import our AI services
from .rag_pipeline.document_processor import DocumentProcessor
from .rag_pipeline.embeddings_manager import EmbeddingsManager
from .rag_pipeline.vector_store import VectorStore
from .rag_pipeline.retriever import DocumentRetriever
from .nlp_services.translator import MultilingualTranslator
from .nlp_services.intent_classifier import IntentClassifier
from .chatbot.response_generator import ResponseGenerator
from .chatbot.context_manager import ConversationContextManager
from .chatbot.conversation_handler import ConversationHandler
from .multimodal.image_processor import ImageProcessor
from .utils.security import SecurityManager
from .utils.validators import InputValidator

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Krishi Seva AI Services",
    description="AI/ML services for agricultural advisory system",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
security_manager = SecurityManager()
input_validator = InputValidator()

# Pydantic Models
class ChatRequest(BaseModel):
    message: str
    user_id: str
    language: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    success: bool
    response: str
    metadata: Dict[str, Any]
    suggestions: List[str]

class ImageAnalysisRequest(BaseModel):
    user_id: str
    description: Optional[str] = None
    language: Optional[str] = "en"

class DocumentUploadResponse(BaseModel):
    success: bool
    message: str
    documents_processed: int

# Global AI service instances
ai_services = {}

@app.on_event("startup")
async def startup_event():
    """Initialize AI services on startup."""
    global ai_services
    
    # Get API keys from environment
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise Exception("GEMINI_API_KEY not found in environment variables")
    
    # Initialize core components
    document_processor = DocumentProcessor(gemini_api_key)
    embeddings_manager = EmbeddingsManager(gemini_api_key)
    vector_store = VectorStore()
    retriever = DocumentRetriever(embeddings_manager, vector_store)
    translator = MultilingualTranslator(gemini_api_key)
    intent_classifier = IntentClassifier(gemini_api_key)
    response_generator = ResponseGenerator(gemini_api_key, retriever, translator, intent_classifier)
    context_manager = ConversationContextManager()
    conversation_handler = ConversationHandler(response_generator, context_manager, retriever, translator)
    image_processor = ImageProcessor(gemini_api_key)
    
    # Store in global dict
    ai_services = {
        'document_processor': document_processor,
        'embeddings_manager': embeddings_manager,
        'vector_store': vector_store,
        'retriever': retriever,
        'translator': translator,
        'intent_classifier': intent_classifier,
        'response_generator': response_generator,
        'context_manager': context_manager,
        'conversation_handler': conversation_handler,
        'image_processor': image_processor
    }
    
    print("AI services initialized successfully")

# Dependency to get authenticated user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Validate JWT token and get current user."""
    try:
        user_data = security_manager.verify_token(credentials.credentials)
        return user_data
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": "AI services running"}

# Main chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    """Main chat endpoint for farmer queries."""
    try:
        # Validate input
        if not input_validator.validate_message(request.message):
            raise HTTPException(status_code=400, detail="Invalid message content")
        
        # Rate limiting check
        if not security_manager.check_rate_limit(request.user_id):
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        # Get user profile from current_user
        user_profile = {
            'user_type': current_user.get('user_type', 'farmer'),
            'location': current_user.get('location'),
            'preferred_language': current_user.get('preferred_language', 'en')
        }
        
        # Add request context if provided
        if request.context:
            user_profile.update(request.context)
        
        # Process the conversation
        conversation_handler = ai_services['conversation_handler']
        result = await conversation_handler.handle_user_message(
            request.user_id, 
            request.message,
            user_profile
        )
        
        return ChatResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Chat endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Image analysis endpoint
@app.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    description: str = Form(""),
    language: str = Form("en"),
    current_user: dict = Depends(get_current_user)
):
    """Analyze uploaded crop images."""
    try:
        # Validate file
        if not input_validator.validate_image_file(file):
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Rate limiting
        if not security_manager.check_rate_limit(user_id):
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        # Process image
        image_processor = ai_services['image_processor']
        file_content = await file.read()
        
        analysis_result = await image_processor.analyze_crop_image(
            file_content, description, language
        )
        
        # If analysis successful, also handle as a conversation
        if analysis_result.get('success'):
            query = f"Image analysis: {description}. Analysis results: {analysis_result.get('analysis', '')}"
            
            conversation_handler = ai_services['conversation_handler']
            chat_result = await conversation_handler.handle_user_message(
                user_id, query, {'user_type': current_user.get('user_type')}
            )
            
            # Combine image analysis with chat response
            return {
                'success': True,
                'image_analysis': analysis_result,
                'ai_advice': chat_result['response'],
                'metadata': chat_result['metadata']
            }
        
        return analysis_result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Image analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail="Image analysis failed")

# Document upload for knowledge base
@app.post("/upload-documents", response_model=DocumentUploadResponse)
async def upload_documents(
    files: List[UploadFile] = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload documents to knowledge base (admin only)."""
    try:
        # Check if user is admin
        if current_user.get('user_type') != 'admin':
            raise HTTPException(status_code=403, detail="Admin access required")
        
        document_processor = ai_services['document_processor']
        embeddings_manager = ai_services['embeddings_manager']
        vector_store = ai_services['vector_store']
        
        total_processed = 0
        
        for file in files:
            if not input_validator.validate_document_file(file):
                continue
            
            # Save file temporarily
            temp_path = f"./temp/{file.filename}"
            os.makedirs(os.path.dirname(temp_path), exist_ok=True)
            
            with open(temp_path, "wb") as f:
                f.write(await file.read())
            
            # Process document
            documents = document_processor.process_agricultural_document(temp_path)
            
            if documents:
                # Generate embeddings
                contents = [doc['content'] for doc in documents]
                embeddings = await embeddings_manager.generate_batch_embeddings(contents)
                
                # Store in vector database
                if vector_store.add_documents(documents, embeddings):
                    total_processed += len(documents)
            
            # Clean up temp file
            os.remove(temp_path)
        
        return DocumentUploadResponse(
            success=True,
            message=f"Successfully processed {total_processed} document chunks",
            documents_processed=total_processed
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Document upload error: {str(e)}")
        raise HTTPException(status_code=500, detail="Document upload failed")

# Get conversation history
@app.get("/conversation/{user_id}")
async def get_conversation_history(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get user's conversation history."""
    try:
        # Users can only access their own history, or admins can access any
        if current_user.get('user_id') != user_id and current_user.get('user_type') != 'admin':
            raise HTTPException(status_code=403, detail="Access denied")
        
        conversation_handler = ai_services['conversation_handler']
        summary = await conversation_handler.get_conversation_summary(user_id)
        
        return summary
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Conversation history error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve conversation history")

# Translate text endpoint
@app.post("/translate")
async def translate_text(
    text: str = Form(...),
    from_lang: str = Form(...),
    to_lang: str = Form(...),
    context: str = Form("agricultural"),
    current_user: dict = Depends(get_current_user)
):
    """Translate agricultural text."""
    try:
        if not input_validator.validate_message(text):
            raise HTTPException(status_code=400, detail="Invalid text content")
        
        translator = ai_services['translator']
        result = await translator.translate_with_context(text, from_lang, to_lang, context)
        
        return {
            'success': True,
            'original_text': text,
            'translated_text': result,
            'from_language': from_lang,
            'to_language': to_lang
        }
        
    except Exception as e:
        print(f"Translation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Translation failed")

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )