import os
import sys
from dotenv import load_dotenv

# Add parent directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

# Load environment variables from the correct path
env_path = os.path.join(parent_dir, '.env')
load_dotenv(env_path)

# Now import the services
try:
    from weather.services.weather_service import weather_service
    from weather.services.location_manager import location_manager
    print("✅ Services imported successfully!")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Trying direct import...")
    
    # Fallback: try importing directly
    import sys
    sys.path.append(current_dir)
    from services.weather_service import weather_service
    from services.location_manager import location_manager

def handle_weather_query(query: str, user_id: str = None) -> str:
    """Handle weather-related queries with proper error handling"""
    print(f"🔍 Processing: {query}")
    
    try:
        # Extract location and days
        location, location_type = location_manager.extract_location_from_query(query, user_id)
        days = location_manager.extract_days_from_query(query)
        
        if not location:
            return "📍 Please specify a location. Example: 'weather in Kochi' or '10.0,76.5'"
        
        print(f"   Extracted: Location={location}, Type={location_type}, Days={days}")
        
        # Get weather data
        if days == 1:
            raw_data = weather_service.get_weather_by_location(location)
            weather_data = weather_service._parse_current_weather(raw_data)
            
            # Get forecast for alerts
            forecast_raw = weather_service.get_weather_forecast(location, 3)
            forecast_data = weather_service._parse_forecast(forecast_raw) if forecast_raw else None
            
            alerts = weather_service.check_agricultural_alerts(weather_data, forecast_data)
            return weather_service.format_weather_response(weather_data, alerts)
        else:
            forecast_raw = weather_service.get_weather_forecast(location, days)
            forecast_data = weather_service._parse_forecast(forecast_raw)
            
            # Get current weather for alerts
            current_raw = weather_service.get_weather_by_location(location)
            current_data = weather_service._parse_current_weather(current_raw) if current_raw else None
            
            alerts = weather_service.check_agricultural_alerts(current_data, forecast_data) if current_data else []
            return weather_service.format_forecast_response(forecast_data, alerts)
            
    except Exception as e:
        return f"❌ Error: {str(e)}"

def main():
    print("🌾 AI Farmer Advisory System - WeatherAPI Demo")
    print("=" * 60)
    print("Using WeatherAPI.com (Instant Activation)")
    print("=" * 60)
    
    # Test user ID
    user_id = "demo_farmer_001"
    
    # Save some demo locations
    location_manager.save_location(user_id, "my farm", "9.9312,76.2673", "farm")
    location_manager.save_location(user_id, "home", "12.9716,77.5946", "residence")
    
    # Test queries
    test_queries = [
        "weather in Kochi",
        "temperature at 51.5074,-0.1278",
        "forecast for Munnar for 3 days",
        "weather in Tokyo",
        "what's the weather like in New York?"
    ]
    
    for query in test_queries:
        print(f"\n👨‍🌾 Farmer: {query}")
        response = handle_weather_query(query, user_id)
        print(f"🤖 System: {response}")
        print("-" * 60)

if __name__ == "__main__":
    main()
