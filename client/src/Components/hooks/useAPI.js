import { useState, useEffect, useCallback } from 'react';
import customAPIService from '../api/customAPIService';

// Generic hook for API calls
export const useAPI = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for user profile
export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const profileData = await customAPIService.getUserProfile();
      setProfile(profileData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const updated = await customAPIService.updateUserProfile(profileData);
      setProfile(updated);
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
};

// Hook for crops
export const useCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCrops = useCallback(async () => {
    try {
      setLoading(true);
      const cropsData = await customAPIService.getCropsWithCache();
      setCrops(cropsData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCrop = useCallback(async (cropData) => {
    try {
      const newCrop = await customAPIService.api.crop.createCrop(cropData);
      setCrops(prev => [...prev, newCrop]);
      return newCrop;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const updateCrop = useCallback(async (cropId, cropData) => {
    try {
      const updated = await customAPIService.api.crop.updateCrop(cropId, cropData);
      setCrops(prev => prev.map(crop => 
        crop.id === cropId ? updated : crop
      ));
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const deleteCrop = useCallback(async (cropId) => {
    try {
      await customAPIService.api.crop.deleteCrop(cropId);
      setCrops(prev => prev.filter(crop => crop.id !== cropId));
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  return { crops, loading, error, addCrop, updateCrop, deleteCrop, refetch: fetchCrops };
};

// Hook for weather
export const useWeather = (location) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (!location) return;
    
    try {
      setLoading(true);
      const weatherData = await customAPIService.getWeatherWithLocation(location);
      setWeather(weatherData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weather, loading, error, refetch: fetchWeather };
};

// Hook for market rates
export const useMarketRates = (filters = {}) => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      const ratesData = await customAPIService.getMarketRatesWithFilter(filters);
      setRates(ratesData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return { rates, loading, error, refetch: fetchRates };
};

// Hook for community messages
export const useCommunityMessages = (filters = {}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const messagesData = await customAPIService.api.community.getMessages(filters);
      setMessages(messagesData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  const addMessage = useCallback(async (messageData) => {
    try {
      const newMessage = await customAPIService.submitCommunityMessage(messageData);
      setMessages(prev => [newMessage, ...prev]);
      return newMessage;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const likeMessage = useCallback(async (messageId) => {
    try {
      await customAPIService.api.community.likeMessage(messageId);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, likes_count: (msg.likes_count || 0) + 1 }
          : msg
      ));
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, addMessage, likeMessage, refetch: fetchMessages };
};

// Hook for disease analysis
export const useDiseaseAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const analyzeImage = useCallback(async (imageFile) => {
    try {
      setAnalyzing(true);
      setError(null);
      setProgress(0);
      
      const result = await customAPIService.analyzeImageWithFallback(
        imageFile, 
        (progressPercent) => setProgress(progressPercent)
      );
      
      setResults(result);
      setProgress(100);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
    setProgress(0);
  }, []);

  return { 
    analyzing, 
    results, 
    error, 
    progress, 
    analyzeImage, 
    clearResults 
  };
};

// Hook for file uploads
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (file) => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      const result = await customAPIService.api.file.uploadFile(formData, setProgress);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploading, progress, error, uploadFile };
};

export default {
  useAPI,
  useUserProfile,
  useCrops,
  useWeather,
  useMarketRates,
  useCommunityMessages,
  useDiseaseAnalysis,
  useFileUpload,
};