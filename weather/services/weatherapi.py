import requests
import os
from datetime import datetime, timedelta
from typing import Dict, Optional
from dotenv import load_dotenv

# Load environment variables from parent directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(env_path)

class WeatherAPIService:
    def __init__(self):
        self.api_key = os.getenv('WEATHERAPI_KEY')
        if not self.api_key:
            # Try loading env again in case it wasn't loaded
            load_dotenv(env_path)
            self.api_key = os.getenv('WEATHERAPI_KEY')
            
        if not self.api_key:
            raise ValueError("WeatherAPI key not configured. Please set WEATHERAPI_KEY in .env file")
        
        print(f"✅ WeatherAPI Key loaded: {self.api_key[:8]}...{self.api_key[-4:]}")
        
        self.base_url = "http://api.weatherapi.com/v1"
        self.last_api_call = 0
        self.call_interval = 1.0  # seconds between API calls
    
    def get_weather_by_location(self, location: str) -> Optional[Dict]:
        """Get current weather using WeatherAPI"""
        self._rate_limit()
        
        url = f"{self.base_url}/current.json"
        params = {
            'key': self.api_key,
            'q': location,
            'aqi': 'no'
        }
        
        try:
            response = requests.get(url, params=params, timeout=15)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 401:
                raise Exception("Invalid WeatherAPI key. Please check your API key.")
            elif response.status_code == 400:
                raise Exception(f"Location '{location}' not found or invalid.")
            else:
                raise Exception(f"WeatherAPI error: {response.status_code} - {response.text}")
                
        except requests.exceptions.Timeout:
            raise Exception("Weather API timeout. Please try again.")
        except requests.exceptions.ConnectionError:
            raise Exception("Network connection error. Please check your internet.")
        except Exception as e:
            raise Exception(f"Failed to fetch weather data: {str(e)}")
    
    def get_weather_forecast(self, location: str, days: int = 1) -> Optional[Dict]:
        """Get weather forecast using WeatherAPI"""
        self._rate_limit()
        
        url = f"{self.base_url}/forecast.json"
        params = {
            'key': self.api_key,
            'q': location,
            'days': days,
            'aqi': 'no',
            'alerts': 'no'
        }
        
        try:
            response = requests.get(url, params=params, timeout=15)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 401:
                raise Exception("Invalid WeatherAPI key. Please check your API key.")
            elif response.status_code == 400:
                raise Exception(f"Location '{location}' not found or invalid.")
            else:
                raise Exception(f"WeatherAPI error: {response.status_code} - {response.text}")
                
        except requests.exceptions.Timeout:
            raise Exception("Weather API timeout. Please try again.")
        except requests.exceptions.ConnectionError:
            raise Exception("Network connection error. Please check your internet.")
        except Exception as e:
            raise Exception(f"Failed to fetch forecast data: {str(e)}")
    
    def _rate_limit(self):
        """Ensure we don't exceed API rate limits"""
        import time
        current_time = time.time()
        time_since_last_call = current_time - self.last_api_call
        
        if time_since_last_call < self.call_interval:
            time.sleep(self.call_interval - time_since_last_call)
        
        self.last_api_call = time.time()
    
    def parse_current_weather(self, data: Dict) -> Dict:
        """Parse WeatherAPI current weather response"""
        current = data['current']
        location = data['location']
        
        return {
            'location': location['name'],
            'country': location['country'],
            'temperature': current['temp_c'],
            'feels_like': current['feelslike_c'],
            'humidity': current['humidity'],
            'description': current['condition']['text'],
            'wind_speed': current['wind_kph'] / 3.6,  # Convert km/h to m/s
            'pressure': current['pressure_mb'],
            'precipitation': current.get('precip_mm', 0),
            'timestamp': datetime.fromtimestamp(current['last_updated_epoch']),
            'coordinates': {
                'lat': location['lat'],
                'lon': location['lon']
            }
        }
    
    def parse_forecast(self, data: Dict) -> Dict:
        """Parse WeatherAPI forecast response"""
        location = data['location']
        forecast_days = data['forecast']['forecastday']
        
        daily_forecasts = []
        for day in forecast_days:
            daily_forecasts.append({
                'date': datetime.fromtimestamp(day['date_epoch']).date(),
                'min_temp': day['day']['mintemp_c'],
                'max_temp': day['day']['maxtemp_c'],
                'avg_humidity': day['day']['avghumidity'],
                'total_rain': day['day']['totalprecip_mm'],
                'conditions': day['day']['condition']['text'],
                'hourly_data': [
                    {
                        'time': hour['time'].split()[1],
                        'temp': hour['temp_c'],
                        'description': hour['condition']['text'],
                        'rain': hour.get('precip_mm', 0)
                    } for hour in day['hour']
                ]
            })
        
        return {
            'location': location['name'],
            'country': location['country'],
            'coordinates': {
                'lat': location['lat'],
                'lon': location['lon']
            },
            'forecasts': daily_forecasts
        }

# Singleton instance
weatherapi_service = WeatherAPIService()
