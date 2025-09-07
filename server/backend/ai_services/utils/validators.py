import re
from typing import Any, Dict, List, Optional
from PIL import Image
import io

class InputValidator:
    def __init__(self):
        # Patterns for validation
        self.email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})
        self.phone_pattern = re.compile(r'^[+]?[1-9]?[0-9]{7,15})
        
        # Allowed file types
        self.allowed_image_types = {'image/jpeg', 'image/png', 'image/webp', 'image/bmp'}
        self.allowed_audio_types = {'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm'}
        self.allowed_document_types = {'text/plain', 'application/pdf', 'application/json'}
        
        # Security patterns
        self.sql_injection_patterns = [
            r'(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)',
            r'(\b(OR|AND)\s+\d+\s*=\s*\d+)',
            r'(--|\/\*|\*\/)',
            r'(\bxp_\w+)',
            r'(sp_\w+)'
        ]
        
        self.xss_patterns = [
            r'<script[^>]*>.*?</script>',
            r'javascript:',
            r'on\w+\s*=',
            r'<iframe[^>]*>.*?</iframe>',
            r'<object[^>]*>.*?</object>',
            r'<embed[^>]*>.*?</embed>'
        ]
    
    def validate_message(self, message: str) -> bool:
        """Validate chat message input."""
        if not message or not isinstance(message, str):
            return False
        
        # Length check
        if len(message.strip()) < 1 or len(message) > 2000:
            return False
        
        # Security checks
        if self._contains_malicious_patterns(message):
            return False
        
        # Basic content validation
        if message.strip().isspace():
            return False
        
        return True
    
    def validate_email(self, email: str) -> bool:
        """Validate email format."""
        if not email or not isinstance(email, str):
            return False
        return bool(self.email_pattern.match(email.lower().strip()))
    
    def validate_phone(self, phone: str) -> bool:
        """Validate phone number format."""
        if not phone or not isinstance(phone, str):
            return False
        # Remove common formatting characters
        clean_phone = re.sub(r'[\s\-\(\)]', '', phone)
        return bool(self.phone_pattern.match(clean_phone))
    
    def validate_image_file(self, file) -> bool:
        """Validate uploaded image file."""
        try:
            # Check MIME type
            if hasattr(file, 'content_type'):
                if file.content_type not in self.allowed_image_types:
                    return False
            
            # Check file size (max 10MB)
            if hasattr(file, 'size'):
                if file.size > 10 * 1024 * 1024:
                    return False
            
            # Try to open with PIL to validate it's a real image
            if hasattr(file, 'file'):
                file_content = file.file.read()
                file.file.seek(0)  # Reset file pointer
            else:
                file_content = file.read()
                if hasattr(file, 'seek'):
                    file.seek(0)
            
            try:
                img = Image.open(io.BytesIO(file_content))
                img.verify()  # Verify it's a valid image
                return True
            except:
                return False
                
        except Exception as e:
            print(f"Image validation error: {str(e)}")
            return False
    
    def validate_audio_file(self, file) -> bool:
        """Validate uploaded audio file."""
        try:
            # Check MIME type
            if hasattr(file, 'content_type'):
                if file.content_type not in self.allowed_audio_types:
                    return False
            
            # Check file size (max 25MB for audio)
            if hasattr(file, 'size'):
                if file.size > 25 * 1024 * 1024:
                    return False
            
            return True
            
        except Exception as e:
            print(f"Audio validation error: {str(e)}")
            return False
    
    def validate_document_file(self, file) -> bool:
        """Validate document file for knowledge base upload."""
        try:
            # Check MIME type
            if hasattr(file, 'content_type'):
                if file.content_type not in self.allowed_document_types:
                    return False
            
            # Check file size (max 50MB for documents)
            if hasattr(file, 'size'):
                if file.size > 50 * 1024 * 1024:
                    return False
            
            return True
            
        except Exception as e:
            print(f"Document validation error: {str(e)}")
            return False
    
    def validate_user_context(self, context: Dict[str, Any]) -> bool:
        """Validate user context data."""
        if not isinstance(context, dict):
            return False
        
        # Define allowed context fields and their validation
        allowed_fields = {
            'crop': lambda x: isinstance(x, str) and len(x) <= 50,
            'location': lambda x: isinstance(x, str) and len(x) <= 100,
            'farming_type': lambda x: x in ['organic', 'conventional', 'mixed'],
            'experience_level': lambda x: x in ['beginner', 'intermediate', 'expert'],
            'preferred_language': lambda x: x in ['en', 'ml', 'hi'],
            'user_type': lambda x: x in ['farmer', 'retailer', 'labour', 'admin']
        }
        
        for key, value in context.items():
            if key not in allowed_fields:
                continue  # Skip unknown fields
            
            validator = allowed_fields[key]
            if not validator(value):
                return False
        
        return True
    
    def _contains_malicious_patterns(self, text: str) -> bool:
        """Check for potentially malicious patterns in text."""
        text_lower = text.lower()
        
        # Check for SQL injection patterns
        for pattern in self.sql_injection_patterns:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True
        
        # Check for XSS patterns
        for pattern in self.xss_patterns:
            if re.search(pattern, text_lower, re.IGNORECASE | re.DOTALL):
                return True
        
        return False
    
    def sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for safe storage."""
        if not filename:
            return "unnamed_file"
        
        # Remove path separators and dangerous characters
        filename = re.sub(r'[<>:"/\\|?*]', '', filename)
        
        # Remove leading/trailing dots and spaces
        filename = filename.strip('. ')
        
        # Limit length
        if len(filename) > 255:
            name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
            max_name_len = 250 - len(ext)
            filename = f"{name[:max_name_len]}.{ext}" if ext else name[:255]
        
        return filename or "unnamed_file"
    
    def validate_coordinates(self, lat: float, lon: float) -> bool:
        """Validate geographical coordinates."""
        try:
            lat = float(lat)
            lon = float(lon)
            
            # Check if coordinates are within valid ranges
            if -90 <= lat <= 90 and -180 <= lon <= 180:
                return True
            return False
            
        except (ValueError, TypeError):
            return False