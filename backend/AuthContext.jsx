import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Use relative path during development to leverage Vite's proxy.
  // VITE_API_BASE_URL will be used in production builds.
  const API_URL = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const handleAuthSuccess = (data) => {
    const { user, token } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setToken(token);
    redirectToDashboard(user.role);
  };

  const login = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const result = await response.json();

    if (result.success) {
      handleAuthSuccess(result.data);
    } else {
      throw new Error(result.message || 'Login failed');
    }
  };

  const signup = async (userData) => {
    const response = await json(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const result = await response.json();

    if (result.success) {
      handleAuthSuccess(result.data);
    } else {
      throw new Error(result.message || 'Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const redirectToDashboard = (role) => {
    const dashboardPath = `/${role}-dashboard`;
    navigate(dashboardPath);
  };

  const value = { user, token, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};