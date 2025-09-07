import google.generativeai as genai
from PIL import Image
import io
import base64
from typing import Dict, Any, Optional, List
import cv2
import numpy as np

class ImageProcessor:
    def __init__(self, gemini_api_key: str):
        genai.configure(api_key=gemini_api_key)
        self.vision_model = genai.GenerativeModel('gemini-pro-vision')
        
        # Common crop diseases and pests for reference
        self.common_issues = {
            'diseases': [
                'leaf spot', 'blight', 'rust', 'powdery mildew', 'bacterial wilt',
                'mosaic virus', 'root rot', 'anthracnose', 'downy mildew'
            ],
            'pests': [
                'aphids', 'caterpillar', 'thrips', 'whitefly', 'spider mites',
                'leaf miner', 'scale insects', 'mealybugs'
            ],
            'deficiencies': [
                'nitrogen deficiency', 'potassium deficiency', 'phosphorus deficiency',
                'iron deficiency', 'magnesium deficiency'
            ]
        }
    
    async def analyze_crop_image(self, image_data: bytes, description: str = "", 
                               language: str = "en") -> Dict[str, Any]:
        """Analyze crop images for diseases, pests, or issues."""
        try:
            # Process image
            image = Image.open(io.BytesIO(image_data))
            
            # Validate and resize image
            processed_image = self._preprocess_image(image)
            
            # Generate analysis prompt
            analysis_prompt = self._create_analysis_prompt(description, language)
            
            # Analyze with Gemini Vision
            response = self.vision_model.generate_content([analysis_prompt, processed_image])
            analysis_text = response.text.strip()
            
            # Extract structured information
            structured_analysis = self._extract_structured_info(analysis_text, language)
            
            # Enhance with computer vision analysis
            cv_analysis = self._basic_cv_analysis(image_data)
            
            return {
                'success': True,
                'analysis': analysis_text,
                'structured_info': structured_analysis,
                'computer_vision': cv_analysis,
                'language': language,
                'metadata': {
                    'image_size': image.size,
                    'image_format': image.format,
                    'analysis_confidence': structured_analysis.get('confidence', 0.5)
                }
            }
            
        except Exception as e:
            print(f"Image analysis error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'analysis': f"Failed to analyze image: {str(e)}"
            }
    
    def _preprocess_image(self, image: Image.Image) -> Image.Image:
        """Preprocess image for analysis."""
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize if too large (keep aspect ratio)
        max_size = 1024
        if max(image.size) > max_size:
            ratio = max_size / max(image.size)
            new_size = tuple(int(dim * ratio) for dim in image.size)
            image = image.resize(new_size, Image.Resampling.LANCZOS)
        
        return image
    
    def _create_analysis_prompt(self, description: str, language: str) -> str:
        """Create analysis prompt for the vision model."""
        lang_instruction = "Respond in Malayalam" if language == 'ml' else "Respond in English"
        
        base_prompt = f"""
        You are an expert agricultural advisor specializing in crop disease and pest identification.
        
        {lang_instruction}.
        
        Analyze this crop image and provide:
        
        1. **Identification**: What plant/crop is this?
        2. **Health Assessment**: Overall plant health condition
        3. **Issues Detected**: Any diseases, pests, or nutritional deficiencies
        4. **Severity**: Rate the severity (mild/moderate/severe) if issues found
        5. **Recommendations**: Specific treatment or management advice
        6. **Prevention**: How to prevent this issue in future
        
        """
        
        if description:
            base_prompt += f"\nAdditional context from farmer: {description}\n"
        
        base_prompt += """
        Be specific and practical in your recommendations. If you're uncertain about identification, 
        mention it and suggest consulting local agricultural experts.
        
        Format your response clearly with the above sections.
        """
        
        return base_prompt
    
    def _extract_structured_info(self, analysis_text: str, language: str) -> Dict[str, Any]:
        """Extract structured information from analysis text."""
        structured = {
            'plant_type': 'unknown',
            'health_status': 'unknown',
            'issues_detected': [],
            'severity': 'unknown',
            'confidence': 0.5,
            'recommendations': []
        }
        
        text_lower = analysis_text.lower()
        
        # Basic plant type detection
        plant_keywords = {
            'rice': ['rice', 'paddy', 'നെല്ല്'],
            'coconut': ['coconut', 'തെങ്ങ്'],
            'banana': ['banana', 'വാഴ'],
            'tomato': ['tomato', 'തക്കാളി'],
            'pepper': ['pepper', 'കുരുമുളക്']
        }
        
        for plant, keywords in plant_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                structured['plant_type'] = plant
                break
        
        # Health status detection
        health_indicators = {
            'healthy': ['healthy', 'good', 'normal', 'fine', 'ആരോഗ്യകരമായ'],
            'diseased': ['disease', 'infected', 'sick', 'രോഗം', 'രോഗബാധിത'],
            'stressed': ['stress', 'deficiency', 'പോഷകക്കുറവ്']
        }
        
        for status, keywords in health_indicators.items():
            if any(keyword in text_lower for keyword in keywords):
                structured['health_status'] = status
                break
        
        # Issue detection
        for category, issues in self.common_issues.items():
            for issue in issues:
                if issue in text_lower:
                    structured['issues_detected'].append({
                        'type': issue,
                        'category': category
                    })
        
        # Severity detection
        if any(word in text_lower for word in ['severe', 'serious', 'critical', 'गंभीर']):
            structured['severity'] = 'severe'
        elif any(word in text_lower for word in ['moderate', 'medium', 'മിതമായ']):
            structured['severity'] = 'moderate'
        elif any(word in text_lower for word in ['mild', 'slight', 'minor', 'ചെറിയ']):
            structured['severity'] = 'mild'
        
        # Confidence based on specificity
        if structured['plant_type'] != 'unknown' and structured['issues_detected']:
            structured['confidence'] = 0.8
        elif structured['plant_type'] != 'unknown':
            structured['confidence'] = 0.6
        
        return structured
    
    def _basic_cv_analysis(self, image_data: bytes) -> Dict[str, Any]:
        """Basic computer vision analysis for additional insights."""
        try:
            # Convert bytes to opencv image
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None:
                return {'error': 'Could not decode image'}
            
            # Color analysis
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            
            # Green color analysis (health indicator)
            green_lower = np.array([40, 40, 40])
            green_upper = np.array([80, 255, 255])
            green_mask = cv2.inRange(hsv, green_lower, green_upper)
            green_percentage = (np.sum(green_mask > 0) / green_mask.size) * 100
            
            # Brown/Yellow analysis (potential disease indicator)
            brown_lower = np.array([10, 50, 50])
            brown_upper = np.array([30, 255, 200])
            brown_mask = cv2.inRange(hsv, brown_lower, brown_upper)
            brown_percentage = (np.sum(brown_mask > 0) / brown_mask.size) * 100
            
            # Image quality metrics
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            return {
                'color_analysis': {
                    'green_percentage': round(green_percentage, 2),
                    'brown_yellow_percentage': round(brown_percentage, 2)
                },
                'image_quality': {
                    'sharpness_score': round(blur_score, 2),
                    'quality_rating': 'good' if blur_score > 100 else 'moderate' if blur_score > 50 else 'poor'
                },
                'dimensions': {
                    'height': image.shape[0],
                    'width': image.shape[1],
                    'channels': image.shape[2]
                }
            }
            
        except Exception as e:
            return {'error': f'CV analysis failed: {str(e)}'}