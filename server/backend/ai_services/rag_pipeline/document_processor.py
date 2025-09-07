import os
import re
import json
from typing import List, Dict, Any
import pandas as pd
from langdetect import detect
import google.generativeai as genai

class DocumentProcessor:
    def __init__(self, gemini_api_key: str):
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """Split text into overlapping chunks."""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
            
        return chunks
    
    def preprocess_text(self, text: str, language: str = 'auto') -> str:
        """Clean and preprocess text."""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Remove special characters but keep Malayalam characters
        if language == 'ml':
            text = re.sub(r'[^\w\s\u0D00-\u0D7F]', '', text)
        else:
            text = re.sub(r'[^\w\s]', '', text)
        
        return text
    
    def detect_language(self, text: str) -> str:
        """Detect language of the text."""
        try:
            lang = detect(text)
            return 'ml' if lang == 'ml' else 'en'
        except:
            return 'en'
    
    def process_agricultural_document(self, file_path: str) -> List[Dict[str, Any]]:
        """Process agricultural documents and extract structured information."""
        try:
            # Read document based on file type
            if file_path.endswith('.txt'):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            elif file_path.endswith('.json'):
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    content = json.dumps(data)
            else:
                raise ValueError("Unsupported file format")
            
            # Detect language
            language = self.detect_language(content)
            
            # Preprocess content
            processed_content = self.preprocess_text(content, language)
            
            # Create chunks
            chunks = self.chunk_text(processed_content)
            
            # Structure the data
            documents = []
            for i, chunk in enumerate(chunks):
                doc = {
                    'id': f"{os.path.basename(file_path)}_{i}",
                    'content': chunk,
                    'language': language,
                    'source': file_path,
                    'chunk_index': i,
                    'metadata': {
                        'file_name': os.path.basename(file_path),
                        'file_type': file_path.split('.')[-1],
                        'word_count': len(chunk.split()),
                        'char_count': len(chunk)
                    }
                }
                documents.append(doc)
            
            return documents
            
        except Exception as e:
            print(f"Error processing document {file_path}: {str(e)}")
            return []