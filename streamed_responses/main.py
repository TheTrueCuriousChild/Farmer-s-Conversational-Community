from fastapi import FastAPI, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import os
from dotenv import load_dotenv
import asyncio
import base64
from datetime import datetime

# ✅ AI services
from ai_services.chatbot.conversation_handler import ConversationHandler
from ai_services.chatbot.response_generator import ResponseGenerator
from ai_services.chatbot.context_manager import ConversationContextManager

from ai_services.nlp_services.language_detector import LanguageDetector
from ai_services.nlp_services.translator import MultilingualTranslator
from ai_services.nlp_services.intent_classifier import IntentClassifier

from ai_services.rag_pipeline.retriever import DocumentRetriever
from ai_services.rag_pipeline.embeddings_manager import EmbeddingsManager
from ai_services.rag_pipeline.vector_store import VectorStore

# ✅ Voice services from updated_voice/services/
from ai_services.chatbot.response_generator import ResponseGenerator as VoiceChatResponse 
from ai_services.services.voice_storage_service import VoiceStorageService

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
voice_storage_service = None

class ChatRequest(BaseModel):
    user_id: str
    message: str
    language: Optional[str] = "en"

class ChatResponse(BaseModel):
    success: bool
    response: str  # HTML formatted response
    main_answer: str  # Plain text main answer
    context: str  # Plain text context
    intent: str
    confidence: float
    language: str
    suggestions: list

class VoiceChatResponse(BaseModel):
    success: bool
    transcript: str
    text_response: str  # HTML formatted
    main_answer: str  # Plain text main answer
    context: str  # Plain text context
    audio_response: str  # base64 encoded
    audio_format: str
    language: str
    intent: str
    confidence: float

@app.on_event("startup")
async def startup_event():
    global ai_services, voice_storage_service
    
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
        
        # RAG Service
        embeddings_manager = EmbeddingsManager(gemini_api_key)
        vector_store = VectorStore()
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
        
        # Voice Storage Service
       # from database.mongodb import get_database
       # voice_storage_service = VoiceStorageService(get_database())
        
        # Store services
        ai_services = {
            'language_detector': language_detector,
            'translator': translator,
            'intent_classifier': intent_classifier,
            'retriever': retriever,
            'response_generator': response_generator,
            'context_manager': context_manager,
            'conversation_handler': conversation_handler,
            'voice_storage': voice_storage_service
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
            user_id=request.user_id,
            message=request.message,
            user_profile={'preferred_language': request.language}
        )
        
        if not result.get('success', False):
            raise HTTPException(status_code=500, detail=result.get('error', 'Processing failed'))
        
        metadata = result.get('metadata', {})
        
        return ChatResponse(
            success=result.get('success', False),
            response=result.get('response', ""),
            main_answer=result.get('main_answer', ""),
            context=result.get('context', ""),
            intent=metadata.get('intent', "general_query"),
            confidence=metadata.get('confidence', 0.0),
            language=metadata.get('language_detected', request.language),
            suggestions=result.get('suggestions', [])
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Chat endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/chat/voice", response_model=VoiceChatResponse)
async def voice_chat_endpoint(
    background_tasks: BackgroundTasks,
    user_id: str = Form(...),
    audio_file: UploadFile = File(...),
    language: Optional[str] = Form("auto"),
    query: Optional[str] = Form("")
):
    try:
        if not ai_services:
            raise HTTPException(status_code=503, detail="AI services not initialized")
        
        # Read audio file
        audio_data = await audio_file.read()
        audio_format = audio_file.filename.split('.')[-1] if audio_file.filename else 'wav'
        
        # Get context documents
        retriever = ai_services['retriever']
        context_docs = await retriever.retrieve_relevant_info(query if query else "")
        
        # Process voice input
        response_generator = ai_services['response_generator']
        voice_result = await response_generator.process_voice_input(
            audio_data, audio_format, query, context_docs, 
            {'preferred_language': language}, language
        )
        
        if not voice_result['success']:
            raise HTTPException(status_code=500, detail=voice_result.get('error'))
        
        text_response = voice_result['text_response']
        
        # Store in database (background task)
        background_tasks.add_task(
            store_voice_conversation,
            user_id, audio_data, audio_format, voice_result
        )
        
        return VoiceChatResponse(
            success=True,
            transcript=voice_result['transcript'],
            text_response=text_response.get('response', ''),
            main_answer=text_response.get('main_answer', ''),
            context=text_response.get('context', ''),
            audio_response=base64.b64encode(voice_result['audio_response']).decode('utf-8'),
            audio_format="mp3",
            language=voice_result['detected_language'],
            intent=text_response.get('intent', 'general'),
            confidence=text_response.get('confidence', 0.0)
        )
        
    except Exception as e:
        print(f"Voice chat endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Voice processing error: {str(e)}")

async def store_voice_conversation(user_id: str, audio_data: bytes, 
                                 audio_format: str, voice_result: Dict):
    """Background task to store voice conversation"""
    try:
        voice_storage = ai_services['voice_storage']
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{user_id}_{timestamp}.{audio_format}"
        
        # Save audio file
        audio_path = voice_storage.save_audio_file(audio_data, filename)
        
        # Prepare conversation data
        conversation_data = {
            'user_id': user_id,
            'audio_file_path': audio_path,
            'audio_duration': 0,
            'audio_format': audio_format,
            'transcript_text': voice_result['transcript'],
            'detected_language': voice_result['detected_language'],
            'gemini_response': voice_result['text_response'].get('response', ''),
            'main_answer': voice_result['text_response'].get('main_answer', ''),
            'context': voice_result['text_response'].get('context', ''),
            'intent': voice_result['text_response'].get('intent', 'general'),
            'confidence': voice_result['text_response'].get('confidence', 0.0)
        }
        
        # Store in MongoDB
        await voice_storage.save_voice_conversation(conversation_data)
        
    except Exception as e:
        print(f"Failed to store voice conversation: {e}")

@app.get("/voice/history/{user_id}")
async def get_voice_history(user_id: str, limit: int = 10):
    """Get user's voice conversation history"""
    try:
        voice_storage = ai_services['voice_storage']
        history = await voice_storage.get_user_voice_history(user_id, limit)
        
        return {
            "success": True,
            "history": [conv.dict() for conv in history],
            "total": len(history)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
            "total_messages': summary.get('total_messages', 0),
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
