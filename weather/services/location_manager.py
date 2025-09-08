import re
from typing import Dict, List, Optional, Tuple
import json
import os
from datetime import datetime, timedelta

class LocationManager:
    def __init__(self):
        self.saved_locations_file = 'data/saved_locations.json'
        self._ensure_data_directory()
        self.saved_locations = self._load_saved_locations()
    
    def _ensure_data_directory(self):
        """Ensure data directory exists"""
        os.makedirs('data', exist_ok=True)
    
    def _load_saved_locations(self) -> Dict:
        """Load saved locations from file"""
        try:
            if os.path.exists(self.saved_locations_file):
                with open(self.saved_locations_file, 'r') as f:
                    return json.load(f)
        except:
            pass
        return {}
    
    def _save_locations(self):
        """Save locations to file"""
        with open(self.saved_locations_file, 'w') as f:
            json.dump(self.saved_locations, f, indent=2)
    
    def extract_location_from_query(self, query: str, user_id: str = None) -> Tuple[Optional[str], Optional[str]]:
        """
        Extract location from query with support for saved locations
        Returns: (location, location_type)
        """
        query_lower = query.lower()
        
        # Check for saved location references
        if user_id and user_id in self.saved_locations:
            for loc_name, loc_data in self.saved_locations[user_id].items():
                if loc_name.lower() in query_lower:
                    return loc_data['coordinates'], 'saved'
        
        # Check for coordinates pattern
        coord_pattern = r'(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)'
        coord_match = re.search(coord_pattern, query)
        if coord_match:
            lat, lon = coord_match.groups()
            return f"{lat},{lon}", 'coordinates'
        
        # Extract city/country names (simple pattern)
        weather_words = {'weather', 'temperature', 'forecast', 'in', 'for', 'of', 'at'}
        words = [word for word in query.split() if word.lower() not in weather_words]
        
        if words:
            return ' '.join(words).strip(), 'city'
        
        return None, None
    
    def extract_days_from_query(self, query: str) -> int:
        """Extract number of days from query"""
        patterns = [
            r'for\s+(\d+)\s+days',
            r'next\s+(\d+)\s+days',
            r'(\d+)-day',
            r'(\d+)\s+day'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, query, re.IGNORECASE)
            if match:
                return min(int(match.group(1)), 5)  # Max 5 days for free tier
        
        return 1  # Default to current day
    
    def save_location(self, user_id: str, location_name: str, coordinates: str, location_type: str = 'farm'):
        """Save a location for a user"""
        if user_id not in self.saved_locations:
            self.saved_locations[user_id] = {}
        
        self.saved_locations[user_id][location_name.lower()] = {
            'coordinates': coordinates,
            'type': location_type,
            'saved_at': datetime.now().isoformat()
        }
        
        self._save_locations()
    
    def get_saved_locations(self, user_id: str) -> Dict:
        """Get all saved locations for a user"""
        return self.saved_locations.get(user_id, {})
    
    def delete_location(self, user_id: str, location_name: str) -> bool:
        """Delete a saved location"""
        if user_id in self.saved_locations and location_name.lower() in self.saved_locations[user_id]:
            del self.saved_locations[user_id][location_name.lower()]
            self._save_locations()
            return True
        return False

# Singleton instance
location_manager = LocationManager()
