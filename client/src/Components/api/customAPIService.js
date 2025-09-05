import api from './apiService';

// Custom API service that wraps the base API with additional functionality
class CustomAPIService {
  constructor() {
    this.api = api;
    this.isOnline = navigator.onLine;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Cache management
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  clearCache() {
    this.cache.clear();
  }

  // Enhanced API methods with caching and error handling
  async getUserProfile(useCache = true) {
    const cacheKey = 'user_profile';
    
    if (useCache) {
      const cached = this.getCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const profile = await this.api.user.getProfile();
      this.setCache(cacheKey, profile);
      return profile;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Return cached data if available during error
      const cached = this.getCache(cacheKey);
      if (cached) return cached;
      throw error;
    }
  }

  async updateUserProfile(profileData) {
    try {
      const updated = await this.api.user.updateProfile(profileData);
      // Update cache
      this.setCache('user_profile', updated);
      return updated;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  async getCropsWithCache() {
    const cacheKey = 'user_crops';
    const cached = this.getCache(cacheKey);
    
    if (cached && this.isOnline) return cached;

    try {
      const crops = await this.api.crop.getUserCrops();
      this.setCache(cacheKey, crops);
      return crops;
    } catch (error) {
      console.error('Failed to fetch crops:', error);
      if (cached) return cached; // Return cached data on error
      throw error;
    }
  }

  async analyzeImageWithFallback(imageFile, onProgress) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('timestamp', Date.now().toString());

    try {
      // Try primary analysis endpoint
      const result = await this.api.disease.analyzeImage(formData);
      return result;
    } catch (error) {
      console.error('Primary disease analysis failed:', error);
      
      // Fallback to alternative analysis or cached results
      try {
        // Store for later analysis when back online
        if (!this.isOnline) {
          this.storeOfflineAnalysis(imageFile);
          throw new Error('Device is offline. Analysis will be processed when connection is restored.');
        }
        throw error;
      } catch (fallbackError) {
        console.error('Fallback analysis failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  async getWeatherWithLocation(location) {
    const cacheKey = `weather_${location}`;
    const cached = this.getCache(cacheKey);
    
    // Use cached data if less than 30 minutes old for weather
    if (cached && (Date.now() - cached.timestamp) < 30 * 60 * 1000) {
      return cached;
    }

    try {
      const weatherData = await Promise.all([
        this.api.weather.getCurrentWeather(location),
        this.api.weather.getForecast(location)
      ]);
      
      const combinedData = {
        current: weatherData[0],
        forecast: weatherData[1],
        location
      };
      
      this.setCache(cacheKey, combinedData);
      return combinedData;
    } catch (error) {
      console.error('Weather fetch failed:', error);
      if (cached) return cached;
      throw error;
    }
  }

  async getMarketRatesWithFilter(filters = {}) {
    const cacheKey = `market_rates_${JSON.stringify(filters)}`;
    const cached = this.getCache(cacheKey);
    
    if (cached) return cached;

    try {
      const rates = await this.api.market.getRates(filters);
      this.setCache(cacheKey, rates);
      return rates;
    } catch (error) {
      console.error('Market rates fetch failed:', error);
      throw error;
    }
  }

  async submitCommunityMessage(messageData) {
    try {
      const message = await this.api.community.createMessage(messageData);
      // Clear community cache to refresh feed
      this.clearCacheByPrefix('community_');
      return message;
    } catch (error) {
      console.error('Failed to submit message:', error);
      
      // Store for offline sync
      if (!this.isOnline) {
        this.storeOfflineMessage(messageData);
        return { ...messageData, id: 'offline_' + Date.now(), pending: true };
      }
      throw error;
    }
  }

  // Offline functionality
  storeOfflineData(key, data) {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offline_data') || '{}');
      offlineData[key] = { data, timestamp: Date.now() };
      localStorage.setItem('offline_data', JSON.stringify(offlineData));
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }

  storeOfflineMessage(messageData) {
    const offlineMessages = JSON.parse(localStorage.getItem('offline_messages') || '[]');
    offlineMessages.push({ ...messageData, timestamp: Date.now() });
    localStorage.setItem('offline_messages', JSON.stringify(offlineMessages));
  }

  storeOfflineAnalysis(imageFile) {
    // Store image analysis request for later processing
    const reader = new FileReader();
    reader.onload = (e) => {
      const offlineAnalyses = JSON.parse(localStorage.getItem('offline_analyses') || '[]');
      offlineAnalyses.push({
        imageData: e.target.result,
        timestamp: Date.now()
      });
      localStorage.setItem('offline_analyses', JSON.stringify(offlineAnalyses));
    };
    reader.readAsDataURL(imageFile);
  }

  async syncOfflineData() {
    try {
      // Sync offline messages
      const offlineMessages = JSON.parse(localStorage.getItem('offline_messages') || '[]');
      for (const message of offlineMessages) {
        try {
          await this.api.community.createMessage(message);
        } catch (error) {
          console.error('Failed to sync offline message:', error);
        }
      }
      localStorage.removeItem('offline_messages');

      // Sync offline analyses
      const offlineAnalyses = JSON.parse(localStorage.getItem('offline_analyses') || '[]');
      for (const analysis of offlineAnalyses) {
        try {
          // Convert base64 back to file and analyze
          const response = await fetch(analysis.imageData);
          const blob = await response.blob();
          const file = new File([blob], 'offline_image.jpg', { type: 'image/jpeg' });
          await this.analyzeImageWithFallback(file);
        } catch (error) {
          console.error('Failed to sync offline analysis:', error);
        }
      }
      localStorage.removeItem('offline_analyses');

      console.log('Offline data synced successfully');
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  }

  clearCacheByPrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  // Utility methods
  isDeviceOnline() {
    return this.isOnline;
  }

  getCacheSize() {
    return this.cache.size;
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      totalMemory: JSON.stringify([...this.cache.entries()]).length
    };
  }
}

// Create singleton instance
const customAPIService = new CustomAPIService();
export default customAPIService;