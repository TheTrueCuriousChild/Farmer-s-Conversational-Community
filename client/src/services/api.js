import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  getUsersByLocation: (location) => api.get('/auth/users', { params: location }),
};

// AI API
export const aiAPI = {
  chat: (message, language = 'en') => api.post('/ai/chat', { message, language }),
  getConversation: () => api.get('/ai/conversation'),
  quickQuery: (queryData) => api.post('/ai/quick-query', queryData),
  health: () => api.get('/ai/health'),
};

// Contact API
export const contactAPI = {
  submitContact: (contactData) => api.post('/contact/contact', contactData),
  submitIVR: (ivrData) => api.post('/contact/ivr', ivrData),
};

// Farmer API
export const farmerAPI = {
  getProfile: () => api.get('/farmers/profile'),
  updateProfile: (profileData) => api.put('/farmers/profile', profileData),
  getCrops: () => api.get('/farmers/crops'),
  addCrop: (cropData) => api.post('/farmers/crops', cropData),
  updateCrop: (id, cropData) => api.put(`/farmers/crops/${id}`, cropData),
  deleteCrop: (id) => api.delete(`/farmers/crops/${id}`),
  getAnalytics: () => api.get('/farmers/analytics'),
};

// Laborer API
export const laborerAPI = {
  getProfile: () => api.get('/laborers/profile'),
  updateProfile: (profileData) => api.put('/laborers/profile', profileData),
  getJobs: () => api.get('/laborers/jobs'),
  applyJob: (jobId) => api.post(`/laborers/jobs/${jobId}/apply`),
  getApplications: () => api.get('/laborers/applications'),
  updateAvailability: (availability) => api.put('/laborers/availability', { availability }),
  getEarnings: () => api.get('/laborers/earnings'),
};

// Rating API
export const ratingAPI = {
  submitRating: (ratingData) => api.post('/ratings', ratingData),
  getRatings: (userId) => api.get(`/ratings/${userId}`),
  updateRating: (ratingId, ratingData) => api.put(`/ratings/${ratingId}`, ratingData),
  deleteRating: (ratingId) => api.delete(`/ratings/${ratingId}`),
};

// Weather API (if available)
export const weatherAPI = {
  getCurrentWeather: (location) => api.get('/weather/current', { params: location }),
  getForecast: (location) => api.get('/weather/forecast', { params: location }),
  getAlerts: (location) => api.get('/weather/alerts', { params: location }),
};

// Market API (if available)
export const marketAPI = {
  getPrices: (crop, location) => api.get('/market/prices', { params: { crop, location } }),
  getTrends: (crop) => api.get('/market/trends', { params: { crop } }),
  getNews: () => api.get('/market/news'),
};

// Utility functions
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      status: 0,
    };
  }
};

// Generic API call wrapper
export const apiCall = async (apiFunction, ...args) => {
  try {
    const response = await apiFunction(...args);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return handleAPIError(error);
  }
};

export default api;
