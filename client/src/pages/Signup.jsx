import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getTranslation } from '../utils/translations';

const Signup = () => {
  const { language } = useLanguage();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    
    // Location fields for farmer/laborer
    location: {
      state: '',
      district: '',
      village: '',
      address: '',
      latitude: '',
      longitude: '',
    },
    
    // Farmer specific
    farmSize: '',
    crops: [],
    certification: 'not-certified',
    
    // Laborer specific
    skills: [],
    experience: '',
    dailyWage: '',
    hourlyWage: '',
    alternatePhone: '',
    
    // Retailer specific
    businessName: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: '',
    },
    businessType: 'other',
    licenseNumber: '',
    taxID: '',
    contactPerson: {
      name: '',
      position: '',
      mobile: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const cropOptions = ['wheat', 'rice', 'corn', 'vegetables', 'fruits', 'cotton', 'other'];
  const skillOptions = ['planting', 'harvesting', 'irrigation', 'pruning', 'pest_control', 'machine_operation', 'packing', 'other'];
  const businessTypes = ['supermarket', 'grocery_store', 'online_store', 'wholesaler', 'restaurant', 'other'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else if (type === 'checkbox') {
      const field = name === 'cropSelect' ? 'crops' : 'skills';
      setFormData(prev => ({
        ...prev,
        [field]: checked 
          ? [...prev[field], value]
          : prev[field].filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    // Common validation
    if (!formData.name.trim()) {
      setError("Name is required.");
      return false;
    }
    
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return false;
    }

    // Role-specific validation
    if (formData.role === 'farmer') {
      if (!formData.location.address.trim()) {
        setError("Farm address is required.");
        return false;
      }
    } else if (formData.role === 'laborer') {
      if (formData.skills.length === 0) {
        setError("Please select at least one skill.");
        return false;
      }
      if (!formData.location.address.trim()) {
        setError("Address is required.");
        return false;
      }
    } else if (formData.role === 'retailer') {
      if (!formData.email.trim()) {
        setError("Email is required for retailers.");
        return false;
      }
      if (!formData.businessName.trim()) {
        setError("Business name is required.");
        return false;
      }
      if (!formData.businessAddress.street.trim() || !formData.businessAddress.city.trim() || 
          !formData.businessAddress.state.trim() || !formData.businessAddress.zipCode.trim()) {
        setError("Complete business address is required.");
        return false;
      }
    }

    return true;
  };

 const prepareSubmitData = () => {
  // Always include the role field for backend routing
  const baseData = {
    role: formData.role, // Always include role for backend
    password: formData.password,
  };

  if (formData.role === 'farmer') {
    const submitData = {
      ...baseData,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      farmLocation: {
        coordinates: [
          parseFloat(formData.location.longitude) || 0,
          parseFloat(formData.location.latitude) || 0
        ],
        address: formData.location.address.trim(),
      },
    };

    // Add optional fields only if they have values
    if (formData.email.trim()) {
      submitData.email = formData.email.trim();
    }
    if (formData.farmSize) {
      submitData.farmSize = parseFloat(formData.farmSize);
    }
    if (formData.crops.length > 0) {
      submitData.crops = formData.crops;
    }
    submitData.certification = formData.certification;

    return submitData;

  } else if (formData.role === 'laborer') {
    const submitData = {
      ...baseData,
      userType: 'laborer', // Laborer schema uses userType internally
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      skills: formData.skills,
      location: {
        coordinates: [
          parseFloat(formData.location.longitude) || 0,
          parseFloat(formData.location.latitude) || 0
        ],
        address: formData.location.address.trim(),
        // ✅ Explicitly required fields for backend validation
        district: formData.location.district?.trim() || "",
        state: formData.location.state?.trim() || "",
      },
      wageExpectation: {
        currency: 'INR',
      },
    };

    // Add optional fields only if they have values
    if (formData.email.trim()) {
      submitData.email = formData.email.trim();
    }
    if (formData.alternatePhone.trim()) {
      submitData.alternatePhone = formData.alternatePhone.trim();
    }
    if (formData.location.village?.trim()) {
      submitData.location.village = formData.location.village.trim();
    }
    if (formData.experience) {
      submitData.experience = parseFloat(formData.experience);
    }
    if (formData.dailyWage) {
      submitData.wageExpectation.daily = parseFloat(formData.dailyWage);
    }
    if (formData.hourlyWage) {
      submitData.wageExpectation.hourly = parseFloat(formData.hourlyWage);
    }

    return submitData;

  } else if (formData.role === 'retailer') {
    const submitData = {
      ...baseData,
      businessName: formData.businessName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      businessAddress: {
        street: formData.businessAddress.street.trim(),
        city: formData.businessAddress.city.trim(),
        state: formData.businessAddress.state.trim(),
        country: formData.businessAddress.country,
        zipCode: formData.businessAddress.zipCode.trim(),
      },
      businessType: formData.businessType,
    };

    // Add optional fields only if they have values
    if (formData.licenseNumber.trim()) {
      submitData.licenseNumber = formData.licenseNumber.trim();
    }
    if (formData.taxID.trim()) {
      submitData.taxID = formData.taxID.trim();
    }
    if (formData.contactPerson.name.trim()) {
      submitData.contactPerson = {
        name: formData.contactPerson.name.trim(),
        position: formData.contactPerson.position.trim(),
        mobile: formData.contactPerson.mobile.trim(),
      };
    }

    return submitData;
  }

  else if (formData.role === 'retailer') {
    const submitData = {
      ...baseData,
      role: 'retailer',
      businessName: formData.businessName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      // retailer schema usually doesn’t need district/state in location,
      // keeping it simple
      address: formData.businessAddress.street.trim(),
      city: formData.businessAddress.city.trim(),
      state: formData.businessAddress.state.trim(),
      country: formData.businessAddress.country,
      zipCode: formData.businessAddress.zipCode.trim(),
      businessType: formData.businessType,
    };

    // Optional fields
    if (formData.licenseNumber.trim()) {
      submitData.licenseNumber = formData.licenseNumber.trim();
    }
    if (formData.taxID.trim()) {
      submitData.taxID = formData.taxID.trim();
    }
    if (formData.contactPerson.name.trim()) {
      submitData.contactPerson = {
        name: formData.contactPerson.name.trim(),
        position: formData.contactPerson.position.trim(),
        mobile: formData.contactPerson.mobile.trim(),
      };
    }

    return submitData;
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const submitData = prepareSubmitData();
      console.log('Sending signup data:', submitData);
      await signup(submitData);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCommonFields = () => (
    <>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Role
        </label>
        <select name="role" value={formData.role} onChange={handleInputChange} required style={{ width: '100%' }}>
          <option value="farmer">Farmer</option>
          <option value="retailer">Retailer</option>
          <option value="laborer">Laborer</option>
        </select>
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          {formData.role === 'retailer' ? 'Business Name' : 'Full Name'} *
        </label>
        <input
          type="text"
          name={formData.role === 'retailer' ? 'businessName' : 'name'}
          value={formData.role === 'retailer' ? formData.businessName : formData.name}
          onChange={handleInputChange}
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Email {formData.role === 'retailer' ? '*' : '(Optional)'}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required={formData.role === 'retailer'}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Password *
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength="6"
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Confirm Password *
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          style={{ width: '100%' }}
        />
      </div>
    </>
  );

  const renderFarmerFields = () => (
    <>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Farm Address *
        </label>
        <input
          type="text"
          name="location.address"
          value={formData.location.address}
          onChange={handleInputChange}
          required
          placeholder="Complete farm address"
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Latitude (Optional)
          </label>
          <input
            type="number"
            name="location.latitude"
            value={formData.location.latitude}
            onChange={handleInputChange}
            step="any"
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Longitude (Optional)
          </label>
          <input
            type="number"
            name="location.longitude"
            value={formData.location.longitude}
            onChange={handleInputChange}
            step="any"
            style={{ width: '100%' }}
          />
        </div>
      </div>
       <div style={{ marginBottom: 'var(--spacing-lg)' }}>
  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
    District *
  </label>
  <input
    type="text"
    name="location.district"
    value={formData.location.district}
    onChange={handleInputChange}
    required
    placeholder="Enter your district"
    style={{ width: '100%' }}
  />
</div>

<div style={{ marginBottom: 'var(--spacing-lg)' }}>
  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
    State *
  </label>
  <input
    type="text"
    name="location.state"
    value={formData.location.state}
    onChange={handleInputChange}
    required
    placeholder="Enter your state"
    style={{ width: '100%' }}
  />
</div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Farm Size (acres) (Optional)
        </label>
        <input
          type="number"
          name="farmSize"
          value={formData.farmSize}
          onChange={handleInputChange}
          min="0"
          step="0.1"
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Crops Grown (Select all that apply) (Optional)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-xs)' }}>
          {cropOptions.map(crop => (
            <label key={crop} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
              <input
                type="checkbox"
                name="cropSelect"
                value={crop}
                checked={formData.crops.includes(crop)}
                onChange={handleInputChange}
                style={{ marginRight: 'var(--spacing-xs)' }}
              />
              {crop.charAt(0).toUpperCase() + crop.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Certification
        </label>
        <select name="certification" value={formData.certification} onChange={handleInputChange} style={{ width: '100%' }}>
          <option value="not-certified">Not Certified</option>
          <option value="organic">Organic</option>
          <option value="non-organic">Non-Organic</option>
          <option value="in-transition">In Transition</option>
        </select>
      </div>
    </>
  );

  const renderLaborerFields = () => (
    <>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Alternate Phone (Optional)
        </label>
        <input
          type="tel"
          name="alternatePhone"
          value={formData.alternatePhone}
          onChange={handleInputChange}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Address *
        </label>
        <input
          type="text"
          name="location.address"
          value={formData.location.address}
          onChange={handleInputChange}
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Village (Optional)
          </label>
          <input
            type="text"
            name="location.village"
            value={formData.location.village}
            onChange={handleInputChange}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            District (Optional)
          </label>
          <input
            type="text"
            name="location.district"
            value={formData.location.district}
            onChange={handleInputChange}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            State (Optional)
          </label>
          <input
            type="text"
            name="location.state"
            value={formData.location.state}
            onChange={handleInputChange}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Latitude (Optional)
          </label>
          <input
            type="number"
            name="location.latitude"
            value={formData.location.latitude}
            onChange={handleInputChange}
            step="any"
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Longitude (Optional)
          </label>
          <input
            type="number"
            name="location.longitude"
            value={formData.location.longitude}
            onChange={handleInputChange}
            step="any"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Skills * (Select all that apply)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-xs)' }}>
          {skillOptions.map(skill => (
            <label key={skill} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
              <input
                type="checkbox"
                name="skillSelect"
                value={skill}
                checked={formData.skills.includes(skill)}
                onChange={handleInputChange}
                style={{ marginRight: 'var(--spacing-xs)' }}
              />
              {skill.replace('_', ' ').charAt(0).toUpperCase() + skill.replace('_', ' ').slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Experience (years) (Optional)
        </label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          min="0"
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Daily Wage (INR) (Optional)
          </label>
          <input
            type="number"
            name="dailyWage"
            value={formData.dailyWage}
            onChange={handleInputChange}
            min="0"
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Hourly Wage (INR) (Optional)
          </label>
          <input
            type="number"
            name="hourlyWage"
            value={formData.hourlyWage}
            onChange={handleInputChange}
            min="0"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </>
  );

  const renderRetailerFields = () => (
    <>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
          Business Type
        </label>
        <select name="businessType" value={formData.businessType} onChange={handleInputChange} style={{ width: '100%' }}>
          {businessTypes.map(type => (
            <option key={type} value={type}>
              {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Business Address *</h3>
        
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Street Address *
          </label>
          <input
            type="text"
            name="businessAddress.street"
            value={formData.businessAddress.street}
            onChange={handleInputChange}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
              City *
            </label>
            <input
              type="text"
              name="businessAddress.city"
              value={formData.businessAddress.city}
              onChange={handleInputChange}
              required
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
              State *
            </label>
            <input
              type="text"
              name="businessAddress.state"
              value={formData.businessAddress.state}
              onChange={handleInputChange}
              required
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
              ZIP Code *
            </label>
            <input
              type="text"
              name="businessAddress.zipCode"
              value={formData.businessAddress.zipCode}
              onChange={handleInputChange}
              required
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
              Country
            </label>
            <input
              type="text"
              name="businessAddress.country"
              value={formData.businessAddress.country}
              onChange={handleInputChange}
              style={{ width: '100%' }}
              disabled
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            License Number (Optional)
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Tax ID (Optional)
          </label>
          <input
            type="text"
            name="taxID"
            value={formData.taxID}
            onChange={handleInputChange}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Contact Person (Optional)</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
              Name
            </label>
            <input
              type="text"
              name="contactPerson.name"
              value={formData.contactPerson.name}
              onChange={handleInputChange}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
              Position
            </label>
            <input
              type="text"
              name="contactPerson.position"
              value={formData.contactPerson.position}
              onChange={handleInputChange}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
            Mobile
          </label>
          <input
            type="tel"
            name="contactPerson.mobile"
            value={formData.contactPerson.mobile}
            onChange={handleInputChange}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </>
  );

  const pageStyle = {
    padding: 'var(--spacing-xl) 0',
    minHeight: '100vh',
  };

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-xl)',
    boxShadow: 'var(--shadow-lg)',
    maxWidth: '800px',
    width: '100%',
    margin: '0 auto',
  };

  return (
    <div style={pageStyle}>
      <div className="container">
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>Create an Account</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Join KrishiSeva Today</p>
          </div>

          {error && (
            <div style={{ 
              color: 'var(--color-danger)', 
              backgroundColor: 'var(--color-danger-light)', 
              padding: 'var(--spacing-md)', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: 'var(--spacing-lg)', 
              textAlign: 'center' 
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderCommonFields()}
            
            {formData.role === 'farmer' && renderFarmerFields()}
            {formData.role === 'laborer' && renderLaborerFields()}
            {formData.role === 'retailer' && renderRetailerFields()}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{ 
                width: '100%', 
                padding: 'var(--spacing-md)', 
                marginBottom: 'var(--spacing-lg)' 
              }}
            >
              {isLoading ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                  &nbsp;Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;