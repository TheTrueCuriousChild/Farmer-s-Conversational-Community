import os
from datetime import datetime
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Load environment variables from parent directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(env_path)

from .weatherapi_service import weatherapi_service

class WeatherService:
    def __init__(self):
        self.agro_alerts = {
            'heavy_rain': {'min_precipitation': 20, 'message': 'Heavy rain expected - delay field activities'},
            'frost': {'max_temp': 2, 'message': 'Frost warning - protect sensitive crops'},
            'heat_wave': {'min_temp': 35, 'message': 'Heat wave warning - increase irrigation'},
            'high_wind': {'min_wind_speed': 15, 'message': 'High winds expected - secure structures'},
            'drought': {'max_precipitation': 1, 'duration': 7, 'message': 'Drought conditions - conserve water'}
        }
    
    def get_weather_by_location(self, location: str) -> Optional[Dict]:
        """Get weather data using WeatherAPI"""
        return weatherapi_service.get_weather_by_location(location)
    
    def get_weather_forecast(self, location: str, days: int = 1) -> Optional[Dict]:
        """Get weather forecast using WeatherAPI"""
        return weatherapi_service.get_weather_forecast(location, days)
    
    def _parse_current_weather(self, data: Dict) -> Dict:
        """Parse weather response"""
        return weatherapi_service.parse_current_weather(data)
    
    def _parse_forecast(self, data: Dict) -> Dict:
        """Parse forecast response"""
        return weatherapi_service.parse_forecast(data)
    
    def check_agricultural_alerts(self, weather_data: Dict, forecast_data: Optional[Dict] = None) -> List[str]:
        """Check for agricultural weather alerts"""
        alerts = []
        
        # Current weather alerts
        if weather_data['precipitation'] > self.agro_alerts['heavy_rain']['min_precipitation']:
            alerts.append(self.agro_alerts['heavy_rain']['message'])
        
        if weather_data['temperature'] < self.agro_alerts['frost']['max_temp']:
            alerts.append(self.agro_alerts['frost']['message'])
        
        if weather_data['temperature'] > self.agro_alerts['heat_wave']['min_temp']:
            alerts.append(self.agro_alerts['heat_wave']['message'])
        
        if weather_data['wind_speed'] > self.agro_alerts['high_wind']['min_wind_speed']:
            alerts.append(self.agro_alerts['high_wind']['message'])
        
        # Forecast alerts (drought detection)
        if forecast_data and len(forecast_data['forecasts']) >= 7:
            total_rain = sum(day['total_rain'] for day in forecast_data['forecasts'][:7])
            if total_rain < self.agro_alerts['drought']['max_precipitation']:
                alerts.append(self.agro_alerts['drought']['message'])
        
        return alerts
    
    def format_weather_response(self, weather_data: Dict, alerts: List[str] = None) -> str:
        """Format weather data for user response"""
        response = (
            f"🌤️ Weather in {weather_data['location']}, {weather_data['country']}:\n"
            f"• Temperature: {weather_data['temperature']}°C (feels like {weather_data['feels_like']}°C)\n"
            f"• Conditions: {weather_data['description']}\n"
            f"• Humidity: {weather_data['humidity']}%\n"
            f"• Wind: {weather_data['wind_speed']:.1f} m/s\n"
            f"• Pressure: {weather_data['pressure']} hPa\n"
            f"• Precipitation: {weather_data['precipitation']} mm\n"
            f"• Updated: {weather_data['timestamp'].strftime('%Y-%m-%d %H:%M')}\n"
            f"• Coordinates: {weather_data['coordinates']['lat']:.4f}, {weather_data['coordinates']['lon']:.4f}"
        )
        
        if alerts:
            response += "\n\n🚨 Agricultural Alerts:\n"
            for alert in alerts:
                response += f"• {alert}\n"
        
        return response
    
    def format_forecast_response(self, forecast_data: Dict, alerts: List[str] = None) -> str:
        """Format forecast data for user response"""
        response = f"📅 {len(forecast_data['forecasts'])}-Day Forecast for {forecast_data['location']}, {forecast_data['country']}:\n"
        
        for day in forecast_data['forecasts']:
            response += (
                f"\n📅 {day['date'].strftime('%Y-%m-%d')}:\n"
                f"• Temp: {day['min_temp']}°C - {day['max_temp']}°C\n"
                f"• Conditions: {day['conditions']}\n"
                f"• Humidity: {day['avg_humidity']}%\n"
                f"• Rain: {day['total_rain']} mm"
            )
        
        if alerts:
            response += "\n\n🚨 Agricultural Alerts:\n"
            for alert in alerts:
                response += f"• {alert}\n"
        
        return response

# Singleton instance
weather_service = WeatherService()
