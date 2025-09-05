const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// API configuration
const api = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Helper function to make API requests
const makeRequest = async (endpoint, options = {}) => {
  const url = `${api.baseURL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    timeout: api.timeout,
    headers: {
      ...api.headers,
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication endpoints
export const authAPI = {
  login: (credentials) => makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData) => makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  logout: () => makeRequest('/auth/logout', {
    method: 'POST',
  }),
  
  refreshToken: () => makeRequest('/auth/refresh', {
    method: 'POST',
  }),
  
  forgotPassword: (email) => makeRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
};

// User management endpoints
export const userAPI = {
  getProfile: () => makeRequest('/users/profile'),
  
  updateProfile: (profileData) => makeRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  
  uploadAvatar: (formData) => makeRequest('/users/avatar', {
    method: 'POST',
    body: formData,
    headers: {}, // Let browser set content-type for FormData
  }),
  
  changePassword: (passwordData) => makeRequest('/users/change-password', {
    method: 'POST',
    body: JSON.stringify(passwordData),
  }),
  
  deleteAccount: () => makeRequest('/users/account', {
    method: 'DELETE',
  }),
};

// Crop management endpoints
export const cropAPI = {
  getAllCrops: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return makeRequest(`/crops${queryString ? `?${queryString}` : ''}`);
  },
  
  getCrop: (cropId) => makeRequest(`/crops/${cropId}`),
  
  createCrop: (cropData) => makeRequest('/crops', {
    method: 'POST',
    body: JSON.stringify(cropData),
  }),
  
  updateCrop: (cropId, cropData) => makeRequest(`/crops/${cropId}`, {
    method: 'PUT',
    body: JSON.stringify(cropData),
  }),
  
  deleteCrop: (cropId) => makeRequest(`/crops/${cropId}`, {
    method: 'DELETE',
  }),
  
  getUserCrops: () => makeRequest('/crops/user'),
  
  updateCropStage: (cropId, stage) => makeRequest(`/crops/${cropId}/stage`, {
    method: 'PATCH',
    body: JSON.stringify({ stage }),
  }),
};

// Disease detection endpoints
export const diseaseAPI = {
  analyzeImage: (formData) => makeRequest('/disease/analyze', {
    method: 'POST',
    body: formData,
    headers: {}, // Let browser set content-type for FormData
  }),
  
  getAnalysisHistory: () => makeRequest('/disease/history'),
  
  getAnalysis: (analysisId) => makeRequest(`/disease/analysis/${analysisId}`),
  
  saveAnalysis: (analysisData) => makeRequest('/disease/analysis', {
    method: 'POST',
    body: JSON.stringify(analysisData),
  }),
  
  getDiseaseInfo: (diseaseName) => makeRequest(`/disease/info/${encodeURIComponent(diseaseName)}`),
  
  getTreatmentOptions: (diseaseId) => makeRequest(`/disease/${diseaseId}/treatments`),
};

// Weather endpoints
export const weatherAPI = {
  getCurrentWeather: (location) => makeRequest(`/weather/current?location=${encodeURIComponent(location)}`),
  
  getForecast: (location, days = 7) => makeRequest(`/weather/forecast?location=${encodeURIComponent(location)}&days=${days}`),
  
  getWeatherAlerts: (location) => makeRequest(`/weather/alerts?location=${encodeURIComponent(location)}`),
  
  getFarmingAdvice: (location, cropType) => makeRequest(`/weather/farming-advice?location=${encodeURIComponent(location)}&crop=${encodeURIComponent(cropType)}`),
  
  getHistoricalData: (location, startDate, endDate) => makeRequest(`/weather/historical?location=${encodeURIComponent(location)}&start=${startDate}&end=${endDate}`),
};

// Community endpoints
export const communityAPI = {
  getMessages: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return makeRequest(`/community/messages${queryString ? `?${queryString}` : ''}`);
  },
  
  createMessage: (messageData) => makeRequest('/community/messages', {
    method: 'POST',
    body: JSON.stringify(messageData),
  }),
  
  updateMessage: (messageId, messageData) => makeRequest(`/community/messages/${messageId}`, {
    method: 'PUT',
    body: JSON.stringify(messageData),
  }),
  
  deleteMessage: (messageId) => makeRequest(`/community/messages/${messageId}`, {
    method: 'DELETE',
  }),
  
  likeMessage: (messageId) => makeRequest(`/community/messages/${messageId}/like`, {
    method: 'POST',
  }),
  
  reportMessage: (messageId, reason) => makeRequest(`/community/messages/${messageId}/report`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),
  
  getUserMessages: () => makeRequest('/community/messages/user'),
};

// Market endpoints
export const marketAPI = {
  getRates: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return makeRequest(`/market/rates${queryString ? `?${queryString}` : ''}`);
  },
  
  getRate: (rateId) => makeRequest(`/market/rates/${rateId}`),
  
  getPriceHistory: (commodity, location, days = 30) => makeRequest(`/market/price-history?commodity=${encodeURIComponent(commodity)}&location=${encodeURIComponent(location)}&days=${days}`),
  
  getPriceAlerts: () => makeRequest('/market/price-alerts'),
  
  createPriceAlert: (alertData) => makeRequest('/market/price-alerts', {
    method: 'POST',
    body: JSON.stringify(alertData),
  }),
  
  getMarkets: (location) => makeRequest(`/market/markets?location=${encodeURIComponent(location)}`),
  
  getCommodities: () => makeRequest('/market/commodities'),
};

// Marketplace/Produce endpoints
export const produceAPI = {
  getAllProduce: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return makeRequest(`/marketplace/produce${queryString ? `?${queryString}` : ''}`);
  },
  
  getProduce: (produceId) => makeRequest(`/marketplace/produce/${produceId}`),
  
  createProduce: (produceData) => makeRequest('/marketplace/produce', {
    method: 'POST',
    body: JSON.stringify(produceData),
  }),
  
  updateProduce: (produceId, produceData) => makeRequest(`/marketplace/produce/${produceId}`, {
    method: 'PUT',
    body: JSON.stringify(produceData),
  }),
  
  deleteProduce: (produceId) => makeRequest(`/marketplace/produce/${produceId}`, {
    method: 'DELETE',
  }),
  
  getUserProduce: () => makeRequest('/marketplace/produce/user'),
  
  uploadProduceImages: (produceId, formData) => makeRequest(`/marketplace/produce/${produceId}/images`, {
    method: 'POST',
    body: formData,
    headers: {},
  }),
  
  contactSeller: (produceId, messageData) => makeRequest(`/marketplace/produce/${produceId}/contact`, {
    method: 'POST',
    body: JSON.stringify(messageData),
  }),
};

// Support endpoints
export const supportAPI = {
  getQueries: () => makeRequest('/support/queries'),
  
  createQuery: (queryData) => makeRequest('/support/queries', {
    method: 'POST',
    body: JSON.stringify(queryData),
  }),
  
  getQuery: (queryId) => makeRequest(`/support/queries/${queryId}`),
  
  updateQuery: (queryId, queryData) => makeRequest(`/support/queries/${queryId}`, {
    method: 'PUT',
    body: JSON.stringify(queryData),
  }),
  
  closeQuery: (queryId) => makeRequest(`/support/queries/${queryId}/close`, {
    method: 'POST',
  }),
  
  getFAQs: () => makeRequest('/support/faqs'),
  
  searchFAQs: (searchTerm) => makeRequest(`/support/faqs/search?q=${encodeURIComponent(searchTerm)}`),
  
  submitFeedback: (feedbackData) => makeRequest('/support/feedback', {
    method: 'POST',
    body: JSON.stringify(feedbackData),
  }),
};

// Government schemes endpoints
export const schemeAPI = {
  getSchemes: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return makeRequest(`/schemes${queryString ? `?${queryString}` : ''}`);
  },
  
  getScheme: (schemeId) => makeRequest(`/schemes/${schemeId}`),
  
  getUserEligibleSchemes: () => makeRequest('/schemes/eligible'),
  
  applyForScheme: (schemeId, applicationData) => makeRequest(`/schemes/${schemeId}/apply`, {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),
  
  getApplications: () => makeRequest('/schemes/applications'),
  
  getApplication: (applicationId) => makeRequest(`/schemes/applications/${applicationId}`),
  
  updateApplication: (applicationId, applicationData) => makeRequest(`/schemes/applications/${applicationId}`, {
    method: 'PUT',
    body: JSON.stringify(applicationData),
  }),
  
  uploadApplicationDocuments: (applicationId, formData) => makeRequest(`/schemes/applications/${applicationId}/documents`, {
    method: 'POST',
    body: formData,
    headers: {},
  }),
};

// File upload endpoints
export const fileAPI = {
  uploadFile: (formData, onProgress) => {
    const xhr = new XMLHttpRequest();
    const token = getAuthToken();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });
      
      xhr.open('POST', `${api.baseURL}/upload`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  },
  
  deleteFile: (fileId) => makeRequest(`/upload/${fileId}`, {
    method: 'DELETE',
  }),
  
  getFileInfo: (fileId) => makeRequest(`/upload/${fileId}`),
};

// Analytics endpoints
export const analyticsAPI = {
  getDashboardStats: () => makeRequest('/analytics/dashboard'),
  
  getCropAnalytics: (cropId) => makeRequest(`/analytics/crops/${cropId}`),
  
  getYieldPrediction: (cropId) => makeRequest(`/analytics/crops/${cropId}/yield-prediction`),
  
  getMarketTrends: (commodity) => makeRequest(`/analytics/market-trends/${encodeURIComponent(commodity)}`),
  
  getUserActivity: () => makeRequest('/analytics/user-activity'),
  
  getWeatherImpact: (cropId) => makeRequest(`/analytics/crops/${cropId}/weather-impact`),
};

// Notification endpoints
export const notificationAPI = {
  getNotifications: () => makeRequest('/notifications'),
  
  markAsRead: (notificationId) => makeRequest(`/notifications/${notificationId}/read`, {
    method: 'POST',
  }),
  
  markAllAsRead: () => makeRequest('/notifications/read-all', {
    method: 'POST',
  }),
  
  getNotificationSettings: () => makeRequest('/notifications/settings'),
  
  updateNotificationSettings: (settings) => makeRequest('/notifications/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
  
  subscribeToNotifications: (subscription) => makeRequest('/notifications/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
  }),
};

export default {
  auth: authAPI,
  user: userAPI,
  crop: cropAPI,
  disease: diseaseAPI,
  weather: weatherAPI,
  community: communityAPI,
  market: marketAPI,
  produce: produceAPI,
  support: supportAPI,
  scheme: schemeAPI,
  file: fileAPI,
  analytics: analyticsAPI,
  notification: notificationAPI,
};