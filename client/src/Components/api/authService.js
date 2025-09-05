import { authAPI } from './apiService';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.refreshTimeout = null;
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      const { user, token, refreshToken } = response;
      
      this.setAuthData(user, token, refreshToken);
      this.scheduleTokenRefresh(token);
      
      return { user, token };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      const { user, token, refreshToken } = response;
      
      this.setAuthData(user, token, refreshToken);
      this.scheduleTokenRefresh(token);
      
      return { user, token };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  async refreshToken() {
    try {
      const response = await authAPI.refreshToken();
      const { token, refreshToken } = response;
      
      this.token = token;
      localStorage.setItem('authToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      this.scheduleTokenRefresh(token);
      return token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuthData();
      throw error;
    }
  }

  // Helper methods
  setAuthData(user, token, refreshToken) {
    this.user = user;
    this.token = token;
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  clearAuthData() {
    this.user = null;
    this.token = null;
    
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  scheduleTokenRefresh(token) {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    
    try {
      // Decode JWT to get expiration (simplified - in production use a proper JWT library)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000;
      const now = Date.now();
      const refreshTime = expiresAt - now - (5 * 60 * 1000); // Refresh 5 minutes before expiry
      
      if (refreshTime > 0) {
        this.refreshTimeout = setTimeout(() => {
          this.refreshToken();
        }, refreshTime);
      }
    } catch (error) {
      console.error('Failed to schedule token refresh:', error);
    }
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  hasRole(role) {
    return this.user?.role === role;
  }

  hasPermission(permission) {
    return this.user?.permissions?.includes(permission) || false;
  }

  // Password management
  async forgotPassword(email) {
    try {
      await authAPI.forgotPassword(email);
      return { success: true };
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  }

  async resetPassword(token, password) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      
      if (!response.ok) {
        throw new Error('Password reset failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  }

  // Initialize auth state on app start
  async initialize() {
    if (this.token && this.user) {
      try {
        // Validate token by making a profile request
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Token validation failed');
        }
        
        const user = await response.json();
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        this.scheduleTokenRefresh(this.token);
        
        return user;
      } catch (error) {
        console.error('Auth initialization failed:', error);
        this.clearAuthData();
        return null;
      }
    }
    return null;
  }
}

// Create singleton instance
const authService = new AuthService();
export default authService;