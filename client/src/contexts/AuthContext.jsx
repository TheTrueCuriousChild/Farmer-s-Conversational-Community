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
    const { user, token, userType } = data;
    // Determine the role from either the user object or the separate userType field
    // for compatibility with different backend versions.
    const role = user.role || userType;

    if (!role) {
      // This will be caught by the UI and displayed to the user.
      throw new Error("Authentication successful, but user role could not be determined.");
    }

    // Ensure the user object in state and localStorage has the role.
    const userWithRole = { ...user, role };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithRole));
    setUser(userWithRole);
    setToken(token);
    redirectToDashboard(role);
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
  const response = await fetch(`http://localhost:5000/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const result = await response.json();
  console.log("Signup response from backend:", result); // 👈 Add this

  if (result.ok) {
    handleAuthSuccess(result.data||result);
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