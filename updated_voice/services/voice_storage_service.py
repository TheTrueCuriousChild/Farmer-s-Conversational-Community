from typing import List, Optional
from datetime import datetime
import os
import uuid
from pydantic import BaseModel, Field

class VoiceConversation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    audio_file_path: str
    audio_duration: float
    audio_format: str
    transcript_text: str
    detected_language: str
    gemini_response: str
    speech_response_path: Optional[str] = None
    intent: str
    confidence: float
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class VoiceStorageService:
    def __init__(self, db_client):
        self.db = db_client
        self.voice_conversations = self.db['voice_conversations']
        self.audio_storage_path = "audio_storage"
        
        # Create storage directory
        os.makedirs(self.audio_storage_path, exist_ok=True)
    
    async def save_voice_conversation(self, voice_data: dict) -> VoiceConversation:
        """Save voice conversation to MongoDB"""
        conversation = VoiceConversation(**voice_data)
        
        # Convert to dict for MongoDB
        conversation_dict = conversation.dict()
        conversation_dict['_id'] = conversation_dict.pop('id')
        
        # Insert into database
        result = await self.voice_conversations.insert_one(conversation_dict)
        
        # Update with MongoDB ID
        conversation.id = str(result.inserted_id)
        return conversation
    
    async def get_user_voice_history(self, user_id: str, limit: int = 10) -> List[VoiceConversation]:
        """Get user's voice conversation history"""
        cursor = self.voice_conversations.find({'user_id': user_id}).sort('created_at', -1).limit(limit)
        conversations = await cursor.to_list(length=limit)
        
        # Convert MongoDB documents to Pydantic models
        result = []
        for conv in conversations:
            conv_data = self._convert_mongo_doc(conv)
            result.append(VoiceConversation(**conv_data))
        
        return result
    
    def save_audio_file(self, audio_data: bytes, filename: str) -> str:
        """Save audio file to local storage"""
        file_path = os.path.join(self.audio_storage_path, filename)
        with open(file_path, 'wb') as f:
            f.write(audio_data)
        return file_path
    
    def get_audio_file(self, file_path: str) -> bytes:
        """Retrieve audio file from storage"""
        with open(file_path, 'rb') as f:
            return f.read()
    
    def _convert_mongo_doc(self, doc):
        """Convert MongoDB document to dict"""
        if doc and '_id' in doc:
            doc['id'] = str(doc['_id'])
            del doc['_id']
        return doc
