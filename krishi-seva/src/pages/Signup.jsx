import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const Signup = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic info
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    
    // Farmer specific
    farmerName: '',
    farmerPhone: '',
    farmLocation: '',
    
    // Retailer specific
    businessName: '',
    retailerEmail: '',
    retailerPhone: '',
    businessAddress: '',
    businessType: '',
    licenseNumber: '',
    taxId: '',
    
    // Labourer specific
    labourerName: '',
    labourerPhone: '',
    alternatePhone: '',
    skills: '',
    experience: '',
    availability: '',
    labourerLocation: '',
    
    // Admin specific
    adminUsername: '',
    adminEmail: '',
    adminPassword: '',
    adminRole: '',
    firstName: '',
    lastName: '',
    adminPhone: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role: role
    });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: API Endpoint: POST /api/register/{role}
    console.log('Registration data:', formData);
    
    // Mock registration
    setTimeout(() => {
      const mockUser = {
        id: Date.now(),
        role: formData.role,
        email: formData.email || formData.retailerEmail || formData.adminEmail,
        name: formData.farmerName || formData.businessName || formData.labourerName || `${formData.firstName} ${formData.lastName}`
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Redirect based on role
      switch (formData.role) {
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
    }, 2000);
  };

  const pageStyle = {
    padding: 'var(--spacing-xxl) 0',
    minHeight: '80vh'
  };

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-xxl)',
    boxShadow: 'var(--shadow-lg)',
    maxWidth: '500px',
    width: '100%',
    margin: '0 auto'
  };

  const roleCardStyle = {
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    backgroundColor: 'var(--color-background)'
  };

  const renderRoleSelection = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>
          Choose Your Role
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Select the role that best describes you
        </p>
      </div>

      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        {[
          { role: 'farmer', icon: '🌾', title: 'Farmer', description: 'Grow crops and manage your farm' },
          { role: 'retailer', icon: '🏪', title: 'Retailer', description: 'Buy and sell agricultural products' },
          { role: 'labourer', icon: '👷', title: 'Labourer', description: 'Provide farming services and labor' },
          { role: 'admin', icon: '👨‍💼', title: 'Admin', description: 'Manage platform operations' }
        ].map((item) => (
          <div
            key={item.role}
            style={roleCardStyle}
            onClick={() => handleRoleSelect(item.role)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.backgroundColor = 'var(--color-surface)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.backgroundColor = 'var(--color-background)';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
              {item.icon}
            </div>
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{item.title}</h3>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFarmerForm = () => (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Farmer Registration</h2>
      
      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            {getTranslation('name', language)} *
          </label>
          <input
            type="text"
            name="farmerName"
            value={formData.farmerName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            {getTranslation('email', language)} *
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

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            {getTranslation('phone', language)} *
          </label>
          <input
            type="tel"
            name="farmerPhone"
            value={formData.farmerPhone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Farm Location *
          </label>
          <input
            type="text"
            name="farmLocation"
            value={formData.farmLocation}
            onChange={handleInputChange}
            placeholder="Enter your farm location"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            {getTranslation('password', language)} *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            {getTranslation('confirmPassword', language)} *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            required
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
        style={{ width: '100%', padding: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}
      >
        {isLoading ? (
          <>
            <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
            Creating Account...
          </>
        ) : (
          'Create Farmer Account'
        )}
      </button>
    </form>
  );

  const renderRetailerForm = () => (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Retailer Registration</h2>
      
      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Business Name *
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="Enter business name"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Contact Email *
          </label>
          <input
            type="email"
            name="retailerEmail"
            value={formData.retailerEmail}
            onChange={handleInputChange}
            placeholder="Enter business email"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Contact Phone *
          </label>
          <input
            type="tel"
            name="retailerPhone"
            value={formData.retailerPhone}
            onChange={handleInputChange}
            placeholder="Enter business phone"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Business Address *
          </label>
          <textarea
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleInputChange}
            placeholder="Enter complete business address"
            required
            rows="3"
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Business Type
          </label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
            style={{ width: '100%' }}
          >
            <option value="">Select business type</option>
            <option value="wholesale">Wholesale</option>
            <option value="retail">Retail</option>
            <option value="export">Export</option>
            <option value="processing">Processing</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            License Number
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            placeholder="Enter business license number"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Tax ID
          </label>
          <input
            type="text"
            name="taxId"
            value={formData.taxId}
            onChange={handleInputChange}
            placeholder="Enter tax identification number"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            {getTranslation('password', language)} *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
            required
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
        style={{ width: '100%', padding: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}
      >
        {isLoading ? (
          <>
            <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
            Creating Account...
          </>
        ) : (
          'Create Retailer Account'
        )}
      </button>
    </form>
  );

  const renderLabourerForm = () => (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Labourer Registration</h2>
      
      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            {getTranslation('name', language)} *
          </label>
          <input
            type="text"
            name="labourerName"
            value={formData.labourerName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Primary Phone *
          </label>
          <input
            type="tel"
            name="labourerPhone"
            value={formData.labourerPhone}
            onChange={handleInputChange}
            placeholder="Enter primary phone number"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Alternate Phone
          </label>
          <input
            type="tel"
            name="alternatePhone"
            value={formData.alternatePhone}
            onChange={handleInputChange}
            placeholder="Enter alternate phone number"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Skills *
          </label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="List your farming skills (e.g., plowing, harvesting, irrigation)"
            required
            rows="3"
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Experience (years) *
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder="Enter years of experience"
            required
            min="0"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Availability *
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            required
            style={{ width: '100%' }}
          >
            <option value="">Select availability</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="seasonal">Seasonal</option>
            <option value="contract">Contract Basis</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Location *
          </label>
          <input
            type="text"
            name="labourerLocation"
            value={formData.labourerLocation}
            onChange={handleInputChange}
            placeholder="Enter your location"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            {getTranslation('password', language)} *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
            required
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
        style={{ width: '100%', padding: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}
      >
        {isLoading ? (
          <>
            <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
            Creating Account...
          </>
        ) : (
          'Create Labourer Account'
        )}
      </button>
    </form>
  );

  const renderAdminForm = () => (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Admin Registration</h2>
      
      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Username *
          </label>
          <input
            type="text"
            name="adminUsername"
            value={formData.adminUsername}
            onChange={handleInputChange}
            placeholder="Enter username"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            {getTranslation('email', language)} *
          </label>
          <input
            type="email"
            name="adminEmail"
            value={formData.adminEmail}
            onChange={handleInputChange}
            placeholder="Enter admin email"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Admin Role *
          </label>
          <select
            name="adminRole"
            value={formData.adminRole}
            onChange={handleInputChange}
            required
            style={{ width: '100%' }}
          >
            <option value="">Select admin role</option>
            <option value="super_admin">Super Admin</option>
            <option value="regional_admin">Regional Admin</option>
            <option value="support_admin">Support Admin</option>
            <option value="audit_admin">Audit Admin</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First name"
              required
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last name"
              required
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            {getTranslation('phone', language)} *
          </label>
          <input
            type="tel"
            name="adminPhone"
            value={formData.adminPhone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            {getTranslation('password', language)} *
          </label>
          <input
            type="password"
            name="adminPassword"
            value={formData.adminPassword}
            onChange={handleInputChange}
            placeholder="Create a secure password"
            required
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
        style={{ width: '100%', padding: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}
      >
        {isLoading ? (
          <>
            <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
            Creating Account...
          </>
        ) : (
          'Create Admin Account'
        )}
      </button>
    </form>
  );

  return (
    <div style={pageStyle}>
      <div className="container">
        <div style={cardStyle}>
          {step === 1 && renderRoleSelection()}
          {step === 2 && formData.role === 'farmer' && renderFarmerForm()}
          {step === 2 && formData.role === 'retailer' && renderRetailerForm()}
          {step === 2 && formData.role === 'labourer' && renderLabourerForm()}
          {step === 2 && formData.role === 'admin' && renderAdminForm()}
          
          {step === 2 && (
            <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
              <button
                onClick={() => setStep(1)}
                className="btn-ghost"
                style={{ color: 'var(--color-primary)' }}
              >
                ← Back to Role Selection
              </button>
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
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


