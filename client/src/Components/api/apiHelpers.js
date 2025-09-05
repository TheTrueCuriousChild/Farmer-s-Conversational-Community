// API utility functions and helpers

// Format API errors for display
export const formatAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return data.message || 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access denied. You do not have permission for this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return data.errors ? formatValidationErrors(data.errors) : 'Validation failed.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.message || `Server error (${status}). Please try again.`;
    }
  } else if (error.request) {
    // Request made but no response received
    return 'Network error. Please check your connection and try again.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

// Format validation errors
export const formatValidationErrors = (errors) => {
  if (Array.isArray(errors)) {
    return errors.join(', ');
  } else if (typeof errors === 'object') {
    return Object.values(errors).flat().join(', ');
  }
  return errors.toString();
};

// Build query string from params object
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  return searchParams.toString();
};

// Parse query string to params object
export const parseQueryString = (queryString) => {
  const params = {};
  const searchParams = new URLSearchParams(queryString);
  
  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  }
  
  return params;
};

// Retry API call with exponential backoff
export const retryAPICall = async (apiCall, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// Debounce API calls
export const debounce = (func, delay) => {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await func.apply(this, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

// Throttle API calls
export const throttle = (func, interval) => {
  let lastCallTime = 0;
  let timeoutId;
  
  return function (...args) {
    const now = Date.now();
    
    return new Promise((resolve, reject) => {
      const remaining = interval - (now - lastCallTime);
      
      const callFunction = async () => {
        try {
          lastCallTime = Date.now();
          const result = await func.apply(this, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      if (remaining <= 0) {
        clearTimeout(timeoutId);
        callFunction();
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(callFunction, remaining);
      }
    });
  };
};

// Cache API responses
export class APICache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }
  
  generateKey(url, params = {}) {
    return `${url}:${JSON.stringify(params)}`;
  }
  
  get(key) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }
    
    // Remove expired entry
    if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }
  
  set(key, data) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  clear() {
    this.cache.clear();
  }
  
  delete(key) {
    this.cache.delete(key);
  }
  
  size() {
    return this.cache.size;
  }
}

// Create global cache instance
export const apiCache = new APICache();

// Cached API call wrapper
export const cachedAPICall = async (apiCall, cacheKey, useCache = true) => {
  if (useCache) {
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }
  
  const result = await apiCall();
  
  if (useCache) {
    apiCache.set(cacheKey, result);
  }
  
  return result;
};

// File upload with progress tracking
export const uploadFileWithProgress = (url, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200 || xhr.status === 201) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });
    
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });
    
    xhr.open('POST', url);
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    
    xhr.send(formData);
  });
};

// Batch API calls
export const batchAPICall = async (apiCalls, concurrency = 3) => {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < apiCalls.length; i += concurrency) {
    const batch = apiCalls.slice(i, i + concurrency);
    
    const batchPromises = batch.map(async (apiCall, index) => {
      try {
        const result = await apiCall();
        return { index: i + index, result };
      } catch (error) {
        return { index: i + index, error };
      }
    });
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach(({ value }) => {
      if (value.error) {
        errors.push({ index: value.index, error: value.error });
      } else {
        results[value.index] = value.result;
      }
    });
  }
  
  return { results, errors };
};

export default {
  formatAPIError,
  formatValidationErrors,
  buildQueryString,
  parseQueryString,
  retryAPICall,
  debounce,
  throttle,
  APICache,
  apiCache,
  cachedAPICall,
  uploadFileWithProgress,
  batchAPICall,
};