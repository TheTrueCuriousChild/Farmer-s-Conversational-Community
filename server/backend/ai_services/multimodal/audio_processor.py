import speech_recognition as sr
from pydub import AudioSegment
import io
import tempfile
import os
from typing import Dict, Any, Optional

class AudioProcessor:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        
        # Configure recognizer for better performance
        self.recognizer.energy_threshold = 300
        self.recognizer.dynamic_energy_threshold = True
        self.recognizer.pause_threshold = 0.8
    
    def process_audio_query(self, audio_data: bytes, language: str = 'en') -> Dict[str, Any]:
        """Process audio input from farmers."""
        try:
            # Convert audio to wav format
            wav_data = self._convert_to_wav(audio_data)
            
            # Transcribe audio
            transcription = self._transcribe_audio(wav_data, language)
            
            if not transcription:
                return {
                    'success': False,
                    'error': 'Could not understand audio',
                    'transcription': ''
                }
            
            return {
                'success': True,
                'transcription': transcription,
                'language': language,
                'confidence': 0.8  # Placeholder confidence
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'transcription': ''
            }
    
    def _convert_to_wav(self, audio_data: bytes) -> bytes:
        """Convert audio to WAV format."""
        try:
            # Load audio with pydub
            audio = AudioSegment.from_file(io.BytesIO(audio_data))
            
            # Convert to wav format
            wav_buffer = io.BytesIO()
            audio.export(wav_buffer, format="wav")
            wav_buffer.seek(0)
            
            return wav_buffer.read()
            
        except Exception as e:
            print(f"Audio conversion error: {str(e)}")
            return audio_data  # Return original if conversion fails
    
    def _transcribe_audio(self, wav_data: bytes, language: str) -> Optional[str]:
        """Transcribe audio to text."""
        try:
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                temp_file.write(wav_data)
                temp_path = temp_file.name
            
            try:
                with sr.AudioFile(temp_path) as source:
                    # Adjust for ambient noise
                    self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
                    audio = self.recognizer.record(source)
                
                # Language mapping for speech recognition
                lang_code = 'en-IN' if language == 'en' else 'ml-IN' if language == 'ml' else 'en-IN'
                
                # Try Google Speech Recognition
                try:
                    text = self.recognizer.recognize_google(audio, language=lang_code)
                    return text
                except sr.RequestError:
                    # Fallback to offline recognition if available
                    try:
                        text = self.recognizer.recognize_sphinx(audio)
                        return text
                    except:
                        return None
                        
            finally:
                os.unlink(temp_path)
                
        except Exception as e:
            print(f"Audio transcription error: {str(e)}")
            return None
