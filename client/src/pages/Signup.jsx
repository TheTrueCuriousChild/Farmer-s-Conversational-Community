import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getTranslation } from '../utils/translations';

const Signup = () => {
  const { language } = useLanguage();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    location: {
      state: '',
      district: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state' || name === 'district') {
      setFormData({
        ...formData,
        location: { ...formData.location, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const finalData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };

    if (!finalData.name) {
      setError("Name is required.");
      return;
    }

    if (!finalData.email && !finalData.phone) {
      setError("Please provide either an email or a phone number.");
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const { confirmPassword, ...submitData } = finalData;

      // Ensure the selected role is also sent as `userType` for backend compatibility.
      submitData.userType = submitData.role;

      // Explicitly remove empty fields to avoid backend issues
      if (!submitData.email) delete submitData.email;
      if (!submitData.phone) delete submitData.phone;

      await signup(submitData);
      // Navigation is handled by AuthContext
    } catch (err) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pageStyle = {
    padding: 'var(--spacing-xxl) 0',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
  };

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-xxl)',
    boxShadow: 'var(--shadow-lg)',
    maxWidth: '500px',
    width: '100%',
    margin: '0 auto',
  };

  const renderInput = (name, type, placeholder, required = true) => (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
      <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
        {getTranslation(name, language)}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        style={{ width: '100%' }}
      />
    </div>
  );

  return (
    <div style={pageStyle}>
      <div className="container">
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>Create an Account</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Join KrishiSeva Today</p>
          </div>

          {error && (
            <div style={{ color: 'var(--color-danger)', backgroundColor: 'var(--color-danger-light)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderInput('name', 'text', 'Enter your full name', true)}
            {renderInput('email', 'email', 'Enter your email', false)}
            {renderInput('phone', 'tel', 'Enter your phone number', false)}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>{getTranslation('state', language)}</label>
                <input type="text" name="state" value={formData.location.state} onChange={handleInputChange} placeholder="e.g., Maharashtra" required style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>{getTranslation('district', language)}</label>
                <input type="text" name="district" value={formData.location.district} onChange={handleInputChange} placeholder="e.g., Pune" required style={{ width: '100%' }} />
              </div>
            </div>

            {renderInput('password', 'password', 'Enter your password', true)}
            {renderInput('confirmPassword', 'password', 'Confirm your password', true)}

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                {getTranslation('role', language)}
              </label>
              <select name="role" value={formData.role} onChange={handleInputChange} required style={{ width: '100%' }}>
                <option value="farmer">{getTranslation('roles.farmer', language)}</option>
                <option value="retailer">{getTranslation('roles.retailer', language)}</option>
                <option value="laborer">{getTranslation('roles.laborer', language)}</option>
              </select>
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
                  &nbsp;Creating Account...
                </>
              ) : (
                getTranslation('signup', language)
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
                {getTranslation('login', language)}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;