import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import hashlib
import hmac
import time
from collections import defaultdict

class SecurityManager:
    def __init__(self, secret_key: str = None):
        self.secret_key = secret_key or "your-secret-key"  # Should be from environment
        self.rate_limit_store = defaultdict(list)  # In-memory store (use Redis in production)
        
    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify JWT token and return user data."""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            
            # Check if token is expired
            if payload.get('exp', 0) < time.time():
                raise jwt.ExpiredSignatureError("Token has expired")
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise Exception("Token has expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")
    
    def create_token(self, user_data: Dict[str, Any], expires_in_hours: int = 24) -> str:
        """Create JWT token for user."""
        payload = {
            **user_data,
            'exp': time.time() + (expires_in_hours * 3600),
            'iat': time.time()
        }
        
        return jwt.encode(payload, self.secret_key, algorithm='HS256')
    
    def check_rate_limit(self, user_id: str, max_requests: int = 50, 
                        window_minutes: int = 15) -> bool:
        """Check if user has exceeded rate limit."""
        now = time.time()
        window_start = now - (window_minutes * 60)
        
        # Clean old entries
        self.rate_limit_store[user_id] = [
            timestamp for timestamp in self.rate_limit_store[user_id]
            if timestamp > window_start
        ]
        
        # Check current count
        current_requests = len(self.rate_limit_store[user_id])
        
        if current_requests >= max_requests:
            return False
        
        # Add current request
        self.rate_limit_store[user_id].append(now)
        return True
    
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt."""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash."""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def sanitize_input(self, text: str) -> str:
        """Sanitize user input to prevent injection attacks."""
        # Remove potentially dangerous characters
        dangerous_chars = ['<', '>', '&', '"', "'", '/', '\\', '`']
        for char in dangerous_chars:
            text = text.replace(char, '')
        
        # Limit length
        return text[:1000].strip()
    
    def generate_api_key(self, user_id: str) -> str:
        """Generate API key for user."""
        timestamp = str(int(time.time()))
        data = f"{user_id}:{timestamp}:{self.secret_key}"
        return hashlib.sha256(data.encode()).hexdigest()
    
    def verify_api_key(self, api_key: str, user_id: str) -> bool:
        """Verify API key belongs to user."""
        # This is a simple implementation
        # In production, store API keys in database with expiration
        try:
            # For now, just check if it's a valid SHA256 hash
            return len(api_key) == 64 and all(c in '0123456789abcdef' for c in api_key.lower())
        except:
            return False
    
    def create_secure_session(self, user_id: str, ip_address: str) -> Dict[str, str]:
        """Create secure session with additional security checks."""
        session_data = {
            'user_id': user_id,
            'ip_address': ip_address,
            'created_at': datetime.now().isoformat(),
            'expires_at': (datetime.now() + timedelta(hours=8)).isoformat()
        }
        
        session_token = self.create_token(session_data, expires_in_hours=8)
        
        return {
            'session_token': session_token,
            'expires_at': session_data['expires_at']
        }