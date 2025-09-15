import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getTranslation } from '../utils/translations';

const Login = () => {
  const { language } = useLanguage();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or phone
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { identifier, password } = formData;
      // Simple check to see if it's a phone number or email
      const isPhone = /^\d{10,}$/.test(identifier);
      const credentials = {
        password,
        ...(isPhone ? { phone: identifier } : { email: identifier })
      };
      await login(credentials);
      // Navigation is handled by AuthContext
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
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

          {error && (
            <div style={{ color: 'var(--color-danger)', backgroundColor: 'var(--color-danger-light)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                {getTranslation('email', language)} / {getTranslation('phone', language)}
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleInputChange}
                placeholder="Enter your email or phone number"
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
                  &nbsp;Signing In...
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
