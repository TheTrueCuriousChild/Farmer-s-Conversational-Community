from typing import Dict, List, Any, Optional
import json
from datetime import datetime, timedelta
import re

class ConversationContextManager:
    def __init__(self, redis_client=None):
        self.redis_client = redis_client
        self.context_cache = {}  # In-memory fallback
        self.context_expiry = timedelta(hours=2)
    
    async def get_user_context(self, user_id: str) -> Dict[str, Any]:
        """Get user's conversation context."""
        try:
            if self.redis_client:
                context_data = await self.redis_client.get(f"user_context:{user_id}")
                if context_data:
                    return json.loads(context_data)
            else:
                # Fallback to in-memory storage
                context_key = f"user_context:{user_id}"
                if context_key in self.context_cache:
                    context_data, timestamp = self.context_cache[context_key]
                    if datetime.now() - timestamp < self.context_expiry:
                        return context_data
                    else:
                        del self.context_cache[context_key]
            
            # Return default context
            return self._get_default_context()
            
        except Exception as e:
            print(f"Error getting user context: {str(e)}")
            return self._get_default_context()
    
    async def update_user_context(self, user_id: str, new_info: Dict[str, Any]):
        """Update user's context with new information."""
        try:
            current_context = await self.get_user_context(user_id)
            
            # Merge new information
            current_context.update(new_info)
            current_context['last_updated'] = datetime.now().isoformat()
            
            # Store updated context
            if self.redis_client:
                await self.redis_client.setex(
                    f"user_context:{user_id}",
                    int(self.context_expiry.total_seconds()),
                    json.dumps(current_context)
                )
            else:
                # Fallback to in-memory storage
                self.context_cache[f"user_context:{user_id}"] = (current_context, datetime.now())
            
            return current_context
            
        except Exception as e:
            print(f"Error updating user context: {str(e)}")
            return current_context if 'current_context' in locals() else self._get_default_context()
    
    async def get_conversation_history(self, user_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Get recent conversation history."""
        try:
            if self.redis_client:
                history_data = await self.redis_client.lrange(f"conversation:{user_id}", 0, limit - 1)
                return [json.loads(msg) for msg in history_data]
            else:
                # Fallback to in-memory storage
                history_key = f"conversation:{user_id}"
                if history_key in self.context_cache:
                    history, _ = self.context_cache[history_key]
                    return history[:limit]
            
            return []
            
        except Exception as e:
            print(f"Error getting conversation history: {str(e)}")
            return []
    
    async def add_to_conversation_history(self, user_id: str, message: Dict[str, Any]):
        """Add message to conversation history."""
        try:
            message['timestamp'] = datetime.now().isoformat()
            
            if self.redis_client:
                await self.redis_client.lpush(f"conversation:{user_id}", json.dumps(message))
                # Keep only last 20 messages
                await self.redis_client.ltrim(f"conversation:{user_id}", 0, 19)
            else:
                # Fallback to in-memory storage
                history_key = f"conversation:{user_id}"
                if history_key not in self.context_cache:
                    self.context_cache[history_key] = ([], datetime.now())
                
                history, _ = self.context_cache[history_key]
                history.insert(0, message)
                if len(history) > 20:
                    history = history[:20]
                
                self.context_cache[history_key] = (history, datetime.now())
            
        except Exception as e:
            print(f"Error adding to conversation history: {str(e)}")
    
    def _get_default_context(self) -> Dict[str, Any]:
        """Get default user context."""
        return {
            'crop': None,
            'location': None,
            'farming_type': None,
            'experience_level': 'intermediate',
            'preferred_language': 'en',
            'current_season': self._get_current_season(),
            'conversation_count': 0,
            'last_updated': datetime.now().isoformat()
        }
    
    def _get_current_season(self) -> str:
        """Determine current agricultural season."""
        current_month = datetime.now().month
        
        if current_month in [6, 7, 8, 9]:  # Monsoon/Kharif
            return 'kharif'
        elif current_month in [10, 11, 12, 1]:  # Winter/Rabi
            return 'rabi'
        else:  # Summer/Zaid
            return 'summer'
    
    async def extract_context_from_query(self, query: str, current_context: Dict[str, Any]) -> Dict[str, Any]:
        """Extract context information from user query."""
        extracted = {}
        query_lower = query.lower()

        # ✅ Extract crop names
        crops = ["rice", "wheat", "maize", "coconut", "sugarcane", "cotton", "pulses"]
        for crop in crops:
            if crop in query_lower:
                extracted["crop"] = crop
                break

        # ✅ Extract location (very basic example — you can expand with regex/NLP)
        locations = ["kerala", "punjab", "maharashtra", "delhi", "karnataka", "tamil nadu"]
        for loc in locations:
            if loc in query_lower:
                extracted["location"] = loc
                break

        # ✅ Detect farming type
        if re.search(r"\borganic\b", query_lower):
            extracted["farming_type"] = "organic"
        elif re.search(r"\btraditional\b", query_lower):
            extracted["farming_type"] = "traditional"

        # ✅ Detect experience hints
        if re.search(r"\bbeginner\b", query_lower):
            extracted["experience_level"] = "beginner"
        elif re.search(r"\bexpert\b", query_lower):
            extracted["experience_level"] = "expert"

        return extracted
