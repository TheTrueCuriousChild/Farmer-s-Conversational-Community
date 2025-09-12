import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const Login = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: API Endpoint: POST /api/auth/login
    console.log('Login attempt:', formData);
    
    // Mock login - simulate API call
    setTimeout(() => {
      // Mock successful login
      const mockUser = {
        id: 1,
        email: formData.email,
        role: 'farmer', // This would come from API
        name: 'John Doe'
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Redirect based on role
      switch (mockUser.role) {
        case 'farmer':
          navigate('/farmer-dashboard');
          break;
        case 'retailer':
          navigate('/retailer-dashboard');
          break;
        case 'labourer':
          navigate('/labourer-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const pageStyle = {
    padding: 'var(--spacing-xxl) 0',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center'
  };

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-xxl)',
    boxShadow: 'var(--shadow-lg)',
    maxWidth: '400px',
    width: '100%',
    margin: '0 auto'
  };

  return (
    <div style={pageStyle}>
      <div className="container">
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-lg)',
              color: 'var(--color-white)',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              KS
            </div>
            <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>
              {getTranslation('login', language)}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Welcome back to KrishiSeva
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                {getTranslation('email', language)}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                {getTranslation('password', language)}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{ width: '100%', padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}
            >
              {isLoading ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                  Signing In...
                </>
              ) : (
                getTranslation('login', language)
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
                {getTranslation('signup', language)}
              </Link>
            </p>
            
            <Link to="/forgot-password" style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }}>
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


