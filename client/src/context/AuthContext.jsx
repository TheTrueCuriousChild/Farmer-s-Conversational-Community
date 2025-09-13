import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, apiCall } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const result = await apiCall(authAPI.getProfile);
      if (result.success) {
        setUser(result.data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const result = await apiCall(authAPI.login, credentials);
      
      if (result.success) {
        const { token, user } = result.data;
        localStorage.setItem('token', token);
        setUser(user);
        return { success: true, user };
      } else {
        return { 
          success: false, 
          error: result.message || 'Login failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const result = await apiCall(authAPI.register, userData);
      
      if (result.success) {
        const { token, user } = result.data;
        localStorage.setItem('token', token);
        setUser(user);
        return { success: true, user };
      } else {
        return { 
          success: false, 
          error: result.message || 'Registration failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const result = await apiCall(authAPI.updateProfile, profileData);
      
      if (result.success) {
        setUser(result.data.user);
        return { success: true, user: result.data.user };
      } else {
        return { 
          success: false, 
          error: result.message || 'Profile update failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Profile update failed' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
