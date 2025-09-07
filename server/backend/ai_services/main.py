from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import asyncio

# Import our AI services
from ai_services.chatbot.conversation_handler import ConversationHandler
from ai_services.chatbot.response_generator import ResponseGenerator
from ai_services.chatbot.context_manager import ConversationContextManager

from ai_services.nlp_services.language_detector import LanguageDetector
from ai_services.nlp_services.translator import MultilingualTranslator
from ai_services.nlp_services.intent_classifier import IntentClassifier

# ✅ Import from rag_pipeline
from ai_services.rag_pipeline.retriever import DocumentRetriever
from ai_services.rag_pipeline.embeddings_manager import EmbeddingsManager
from ai_services.rag_pipeline.vector_store import VectorStore

# Load environment variables
load_dotenv()

app = FastAPI(title="Krishi Seva AI Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
ai_services = {}

class ChatRequest(BaseModel):
    user_id: str
    message: str
    language: Optional[str] = "en"

class ChatResponse(BaseModel):
    success: bool
    response: str
    intent: str
    confidence: float
    language: str
    suggestions: list


@app.on_event("startup")
async def startup_event():
    global ai_services
    
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise Exception("GEMINI_API_KEY not found in environment variables")
    
    try:
        # Initialize core services
        print("🤖 Initializing AI services...")
        
        # NLP Services
        language_detector = LanguageDetector()
        translator = MultilingualTranslator(gemini_api_key)
        intent_classifier = IntentClassifier(gemini_api_key)
        
        # ✅ RAG Service
        embeddings_manager = EmbeddingsManager(gemini_api_key)  # fixed
        vector_store = VectorStore()  # ⚠️ check if it requires params
        retriever = DocumentRetriever(embeddings_manager, vector_store)
        
        # Chatbot Services  
        response_generator = ResponseGenerator(
            gemini_api_key,
            retriever,
            translator,
            intent_classifier
        )
        context_manager = ConversationContextManager()
        conversation_handler = ConversationHandler(response_generator, context_manager)
        
        # Store services
        ai_services = {
            'language_detector': language_detector,
            'translator': translator,
            'intent_classifier': intent_classifier,
            'retriever': retriever,
            'response_generator': response_generator,
            'context_manager': context_manager,
            'conversation_handler': conversation_handler
        }
        
        print("✅ All AI services initialized successfully")
        
    except Exception as e:
        print(f"❌ Error initializing AI services: {str(e)}")
        raise e


@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "Krishi Seva AI",
        "services_loaded": len(ai_services),
        "available_services": list(ai_services.keys())
    }


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        if not ai_services:
            raise HTTPException(status_code=503, detail="AI services not initialized")
        
        conversation_handler = ai_services['conversation_handler']
        
        # Process the conversation
        result = await conversation_handler.handle_user_message(
            request.user_id, 
            request.message, 
            {'preferred_language': request.language}
        )
        
        if not result['success']:
            raise HTTPException(status_code=500, detail=result.get('error', 'Processing failed'))
        
        return ChatResponse(
            success=result['success'],
            response=result['response'],
            intent=result['metadata']['intent'],
            confidence=result['metadata']['confidence'],
            language=result['metadata']['language_detected'],
            suggestions=result['suggestions']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Chat endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/conversation/{user_id}")
async def get_conversation_history(user_id: str):
    try:
        if not ai_services:
            raise HTTPException(status_code=503, detail="AI services not initialized")
        
        conversation_handler = ai_services['conversation_handler']
        summary = await conversation_handler.get_conversation_summary(user_id)
        
        return {
            "success": True,
            "conversation_history": summary.get('recent_activity', []),
            "total_messages": summary.get('total_messages', 0),
            "summary": summary.get('summary', ''),
            "main_topics": summary.get('main_topics', [])
        }
        
    except Exception as e:
        print(f"Conversation history error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/translate")
async def translate_endpoint(
    text: str,
    from_lang: str = "auto",
    to_lang: str = "en",
    context: str = "agricultural"
):
    try:
        if not ai_services:
            raise HTTPException(status_code=503, detail="AI services not initialized")
        
        translator = ai_services['translator']
        
        # Detect language if auto
        if from_lang == "auto":
            language_detector = ai_services['language_detector']
            lang_info = language_detector.detect_language(text)
            from_lang = lang_info['language']
        
        # Translate
        translated_text = await translator.translate_with_context(text, from_lang, to_lang, context)
        
        return {
            "success": True,
            "original_text": text,
            "translated_text": translated_text,
            "from_language": from_lang,
            "to_language": to_lang,
            "context": context
        }
        
    except Exception as e:
        print(f"Translation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/classify-intent")
async def classify_intent_endpoint(text: str, language: str = "en"):
    try:
        if not ai_services:
            raise HTTPException(status_code=503, detail="AI services not initialized")
        
        intent_classifier = ai_services['intent_classifier']
        
        # Classify using rule-based approach
        result = intent_classifier.classify_intent_rule_based(text)
        
        return {
            "success": True,
            "text": text,
            "intent": result['primary_intent'],
            "confidence": result['confidence'],
            "method": result['method'],
            "all_intents": result.get('all_intents', {})
        }
        
    except Exception as e:
        print(f"Intent classification error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/language/detect")
async def detect_language_endpoint(text: str):
    try:
        if not ai_services:
            raise HTTPException(status_code=503, detail="AI services not initialized")
        
        language_detector = ai_services['language_detector']
        result = language_detector.detect_language(text)
        
        return {
            "success": True,
            "text": text,
            "detected_language": result['language'],
            "confidence": result['confidence'],
            "is_mixed": language_detector.is_mixed_language(text)
        }
        
    except Exception as e:
        print(f"Language detection error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health/services")
async def service_health_check():
    health_status = {}
    
    for service_name, service in ai_services.items():
        try:
            if hasattr(service, '__class__'):
                health_status[service_name] = {
                    "status": "healthy",
                    "type": service.__class__.__name__
                }
            else:
                health_status[service_name] = {
                    "status": "unknown",
                    "type": "unknown"
                }
        except Exception as e:
            health_status[service_name] = {
                "status": "unhealthy",
                "error": str(e)
            }
    
    return {
        "overall_status": "healthy" if all(s.get("status") == "healthy" for s in health_status.values()) else "degraded",
        "services": health_status,
        "total_services": len(health_status)
    }


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Krishi Seva AI Service...")
    print("📊 Service will be available at: http://localhost:8000")
    print("📚 API docs will be available at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
