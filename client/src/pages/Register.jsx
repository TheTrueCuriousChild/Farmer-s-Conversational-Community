import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, translations } from '../context/LanguageContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, User, Mail, Phone, MapPin, Building, Wrench, Shield } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Farmer specific
    farmAddress: '',
    farmSize: '',
    crops: [],
    certification: 'not-certified',
    // Retailer specific
    businessName: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: ''
    },
    businessType: 'other',
    licenseNumber: '',
    taxID: '',
    contactPerson: {
      name: '',
      position: '',
      mobile: ''
    },
    // Laborer specific
    skills: [],
    experience: '',
    availability: 'available',
    location: {
      village: '',
      district: '',
      address: ''
    },
    alternatePhone: '',
    wageExpectation: {
      daily: '',
      hourly: '',
      currency: 'INR'
    },
    // Admin specific
    username: '',
    personalInfo: {
      firstName: '',
      lastName: ''
    },
    adminRole: 'support_admin',
    permissions: []
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language];

  // Role-specific field configurations
  const roleConfigs = {
    farmer: {
      title: t.farmer,
      icon: '🌾',
      color: 'from-green-400 to-green-600',
      fields: ['name', 'phone', 'email', 'password', 'farmAddress', 'farmSize', 'crops', 'certification']
    },
    retailer: {
      title: t.retailer,
      icon: '🏪',
      color: 'from-blue-400 to-blue-600',
      fields: ['businessName', 'email', 'phone', 'password', 'businessAddress', 'businessType', 'licenseNumber', 'taxID']
    },
    laborer: {
      title: t.laborer,
      icon: '👷',
      color: 'from-orange-400 to-orange-600',
      fields: ['name', 'phone', 'email', 'password', 'skills', 'experience', 'availability', 'location', 'alternatePhone']
    },
    admin: {
      title: t.admin,
      icon: '👨‍💼',
      color: 'from-purple-400 to-purple-600',
      fields: ['username', 'email', 'password', 'personalInfo', 'adminRole']
    }
  };

  const cropOptions = [
    'wheat', 'rice', 'corn', 'vegetables', 'fruits', 'cotton', 'other'
  ];

  const skillOptions = [
    'planting', 'harvesting', 'irrigation', 'pruning', 'pest_control', 'machine_operation', 'packing', 'other'
  ];

  const businessTypeOptions = [
    'supermarket', 'grocery_store', 'online_store', 'wholesaler', 'restaurant', 'other'
  ];

  const certificationOptions = [
    'organic', 'non-organic', 'in-transition', 'not-certified'
  ];

  const availabilityOptions = [
    'full_time', 'part_time', 'seasonal', 'available', 'not_available'
  ];

  const adminRoleOptions = [
    'super_admin', 'regional_admin', 'support_admin', 'audit_admin'
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? !prev[parent][child] : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? !prev[name] : value
      }));
    }
  };

  const handleArrayChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const validateStep = (stepNumber) => {
    if (stepNumber === 1) {
      // Only check if role is selected
      return formData.role;
    }
    if (stepNumber === 2) {
      // Check basic info fields
      return formData.name && formData.phone;
    }
    if (stepNumber === 3) {
      // Check password fields
      return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
    }
    if (stepNumber === 4) {
      // Check role-specific required fields
      if (formData.role === 'farmer') {
        return formData.farmAddress;
      }
      if (formData.role === 'retailer') {
        return formData.businessName && formData.businessAddress.street && formData.businessAddress.city && formData.businessAddress.state;
      }
      if (formData.role === 'laborer') {
        return formData.skills.length > 0 && formData.location.address;
      }
      if (formData.role === 'admin') {
        return formData.username;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    } else {
      let errorMessage = '';
      if (step === 1) {
        errorMessage = language === 'en' ? 'Please select a role' : 'ഒരു പങ്കാളിത്തം തിരഞ്ഞെടുക്കുക';
      } else if (step === 2) {
        errorMessage = language === 'en' ? 'Please fill in your name and phone number' : 'നിങ്ങളുടെ പേരും ഫോൺ നമ്പറും നൽകുക';
      } else if (step === 3) {
        if (!formData.password || !formData.confirmPassword) {
          errorMessage = language === 'en' ? 'Please enter and confirm your password' : 'പാസ്‌വേഡ് നൽകുകയും സ്ഥിരീകരിക്കുകയും ചെയ്യുക';
        } else if (formData.password !== formData.confirmPassword) {
          errorMessage = language === 'en' ? 'Passwords do not match' : 'പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല';
        }
      } else if (step === 4) {
        if (formData.role === 'farmer') {
          errorMessage = language === 'en' ? 'Please enter your farm address' : 'നിങ്ങളുടെ കൃഷിസ്ഥല വിലാസം നൽകുക';
        } else if (formData.role === 'retailer') {
          errorMessage = language === 'en' ? 'Please fill in business details' : 'ബിസിനസ് വിവരങ്ങൾ പൂരിപ്പിക്കുക';
        } else if (formData.role === 'laborer') {
          errorMessage = language === 'en' ? 'Please select your skills and enter address' : 'നിങ്ങളുടെ കഴിവുകൾ തിരഞ്ഞെടുക്കുകയും വിലാസം നൽകുകയും ചെയ്യുക';
        } else if (formData.role === 'admin') {
          errorMessage = language === 'en' ? 'Please enter a username' : 'ഒരു യൂസർനെയ് നൽകുക';
        }
      }
      toast.error(errorMessage);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data based on role
      const submitData = { ...formData };
      
      // Remove confirmPassword before sending
      delete submitData.confirmPassword;

      // Role-specific data preparation
      if (submitData.role === 'farmer') {
        submitData.farmLocation = {
          type: 'Point',
          coordinates: [0, 0], // Placeholder - would normally get from map/location service
          address: submitData.farmAddress
        };
        delete submitData.farmAddress;
      }

      if (submitData.role === 'retailer') {
        submitData.businessAddress = {
          ...submitData.businessAddress,
          street: submitData.businessAddress.street || '',
          city: submitData.businessAddress.city || '',
          state: submitData.businessAddress.state || '',
          country: 'India',
          zipCode: submitData.businessAddress.zipCode || ''
        };
      }

      if (submitData.role === 'laborer') {
        submitData.location = {
          type: 'Point',
          coordinates: [0, 0], // Placeholder
          address: submitData.location.address,
          village: submitData.location.village,
          district: submitData.location.district
        };
        submitData.wageExpectation = {
          daily: submitData.wageExpectation.daily || 0,
          hourly: submitData.wageExpectation.hourly || 0,
          currency: 'INR'
        };
      }

      if (submitData.role === 'admin') {
        submitData.passwordHash = submitData.password;
        delete submitData.password;
      }

      const result = await register(submitData);
      
      if (result.success) {
        toast.success(language === 'en' ? 'Registration successful!' : 'രജിസ്റ്റ്രേഷൻ വിജയിച്ചു!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(language === 'en' ? 'An error occurred during registration' : 'രജിസ്റ്റ്രേഷൻ സമയത്ത് ഒരു പിശക് സംഭവിച്ചു');
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <h2 className={`text-3xl font-bold text-center ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {t.selectRole}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(roleConfigs).map(([role, config]) => (
            <button
              key={role}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role }))}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                formData.role === role
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300 hover:shadow-md'
              }`}
            >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{config.icon}</span>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${
                  isDarkMode ? 'text-black' : 'text-gray-900'
                }`}>
                  {config.title}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {language === 'en' 
                    ? `Join as ${config.title.toLowerCase()}`
                    : `${config.title} ആയി ചേരുക`
                  }
                </p>
              </div>
              {formData.role === role && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {language === 'en' ? 'Basic Information' : 'അടിസ്ഥാന വിവരങ്ങൾ'}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t.fullName} *
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input pl-10"
              placeholder={language === 'en' ? 'Enter your full name' : 'നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക'}
              required
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t.phoneNumber} *
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input pl-10"
              placeholder={language === 'en' ? 'Enter your phone number' : 'നിങ്ങളുടെ ഫോൺ നമ്പർ നൽകുക'}
              required
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t.emailAddress}
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input pl-10"
              placeholder={language === 'en' ? 'Enter your email (optional)' : 'നിങ്ങളുടെ ഇമെയിൽ നൽകുക (ഓപ്ഷണൽ)'}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPasswordSection = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {language === 'en' ? 'Create Password' : 'പാസ്‌വേഡ് സൃഷ്ടിക്കുക'}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t.password} *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input pl-10 pr-10"
              placeholder={language === 'en' ? 'Create a strong password' : 'ശക്തമായ ഒരു പാസ്‌വേഡ് സൃഷ്ടിക്കുക'}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t.confirmPassword} *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input pl-10 pr-10"
              placeholder={language === 'en' ? 'Confirm your password' : 'നിങ്ങളുടെ പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക'}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFarmerFields = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {language === 'en' ? 'Farm Details' : 'കൃഷിസ്ഥല വിവരങ്ങൾ'}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Farm Address' : 'കൃഷിസ്ഥല വിലാസം'} *
          </label>
          <div className="relative">
            <input
              type="text"
              name="farmAddress"
              value={formData.farmAddress}
              onChange={handleChange}
              className="form-input pl-10"
              placeholder={language === 'en' ? 'Enter farm address' : 'കൃഷിസ്ഥല വിലാസം നൽകുക'}
              required
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Farm Size (acres)' : 'കൃഷിസ്ഥല വലുപ്പം (ഏക്കർ)'}
          </label>
          <input
            type="number"
            name="farmSize"
            value={formData.farmSize}
            onChange={handleChange}
            className="form-input"
            placeholder={language === 'en' ? 'Enter farm size' : 'കൃഷിസ്ഥല വലുപ്പം നൽകുക'}
            min="0"
            step="0.1"
          />
        </div>

        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Crops Grown' : 'നടുന്ന വിളകൾ'}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {cropOptions.map(crop => (
              <label key={crop} className={`flex items-center space-x-2 cursor-pointer ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.crops.includes(crop)}
                  onChange={() => handleArrayChange('crops', crop)}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-sm capitalize">{crop}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Certification' : 'സർടിഫിക്കേഷൻ'}
          </label>
          <select
            name="certification"
            value={formData.certification}
            onChange={handleChange}
            className="form-input"
          >
            {certificationOptions.map(option => (
              <option key={option} value={option}>
                {language === 'en' ? option.replace('_', ' ').toUpperCase() : option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderRetailerFields = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {language === 'en' ? 'Business Details' : 'ബിസിനസ് വിവരങ്ങൾ'}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Business Name' : 'ബിസിനസ് പേര്'} *
          </label>
          <div className="relative">
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="form-input pl-10"
              placeholder={language === 'en' ? 'Enter business name' : 'ബിസിനസ് പേര് നൽകുക'}
              required
            />
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Business Type' : 'ബിസിനസ് ടൈപ്പ്'}
          </label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="form-input"
          >
            {businessTypeOptions.map(type => (
              <option key={type} value={type}>
                {language === 'en' ? type.replace('_', ' ').toUpperCase() : type}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Business Address' : 'ബിസിനസ് വിലാസം'} *
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="businessAddress.street"
              value={formData.businessAddress.street}
              onChange={handleChange}
              className="form-input"
              placeholder={language === 'en' ? 'Street address' : 'തെരുവ് വിലാസം'}
              required
            />
            <input
              type="text"
              name="businessAddress.city"
              value={formData.businessAddress.city}
              onChange={handleChange}
              className="form-input"
              placeholder={language === 'en' ? 'City' : 'പട്ടണം'}
              required
            />
            <input
              type="text"
              name="businessAddress.state"
              value={formData.businessAddress.state}
              onChange={handleChange}
              className="form-input"
              placeholder={language === 'en' ? 'State' : 'സംസ്ഥാനം'}
              required
            />
            <input
              type="text"
              name="businessAddress.zipCode"
              value={formData.businessAddress.zipCode}
              onChange={handleChange}
              className="form-input"
              placeholder={language === 'en' ? 'ZIP Code' : 'പിൻ കോഡ്'}
              required
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'License Number' : 'ലൈസൻസ് നമ്പർ'}
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="form-input"
            placeholder={language === 'en' ? 'Enter license number' : 'ലൈസൻസ് നമ്പർ നൽകുക'}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Tax ID' : 'ടാക്സ് ഐഡി'}
          </label>
          <input
            type="text"
            name="taxID"
            value={formData.taxID}
            onChange={handleChange}
            className="form-input"
            placeholder={language === 'en' ? 'Enter tax ID' : 'ടാക്സ് ഐഡി നൽകുക'}
          />
        </div>
      </div>
    </div>
  );

  const renderLaborerFields = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {language === 'en' ? 'Work Details' : 'ജോലി വിവരങ്ങൾ'}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Skills' : 'കഴിവുകൾ'} *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {skillOptions.map(skill => (
              <label key={skill} className={`flex items-center space-x-2 cursor-pointer ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleArrayChange('skills', skill)}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-sm capitalize">{skill.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Experience (years)' : 'അനുഭവം (വർഷം)'}
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="form-input"
            placeholder={language === 'en' ? 'Years of experience' : 'വർഷത്തിലെ അനുഭവം'}
            min="0"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Availability' : 'ലഭ്യത'}
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="form-input"
          >
            {availabilityOptions.map(option => (
              <option key={option} value={option}>
                {language === 'en' ? option.replace('_', ' ').toUpperCase() : option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Village' : 'ഗ്രാമം'}
          </label>
          <input
            type="text"
            name="location.village"
            value={formData.location.village}
            onChange={handleChange}
            className="form-input"
            placeholder={language === 'en' ? 'Enter village' : 'ഗ്രാമം നൽകുക'}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'District' : 'ജില്ല'}
          </label>
          <input
            type="text"
            name="location.district"
            value={formData.location.district}
            onChange={handleChange}
            className="form-input"
            placeholder={language === 'en' ? 'Enter district' : 'ജില്ല നൽകുക'}
          />
        </div>

        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Full Address' : 'പൂർണ്ണ വിലാസം'} *
          </label>
          <textarea
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            className="form-input"
            placeholder={language === 'en' ? 'Enter full address' : 'പൂർണ്ണ വിലാസം നൽകുക'}
            rows="3"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderAdminFields = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {language === 'en' ? 'Admin Details' : 'അഡ്മിൻ വിവരങ്ങൾ'}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Username' : 'യൂസർനെയ്'} *
          </label>
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input pl-10"
              placeholder={language === 'en' ? 'Choose a username' : 'ഒരു യൂസർനെയ് തിരഞ്ഞെടുക്കുക'}
              required
            />
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Admin Role' : 'അഡ്മിൻ റോൾ'} *
          </label>
          <select
            name="adminRole"
            value={formData.adminRole}
            onChange={handleChange}
            className="form-input"
            required
          >
            {adminRoleOptions.map(role => (
              <option key={role} value={role}>
                {language === 'en' ? role.replace('_', ' ').toUpperCase() : role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'First Name' : 'പേരുകളിലെ ആദ്യം'}
          </label>
          <input
            type="text"
            name="personalInfo.firstName"
            value={formData.personalInfo.firstName}
            onChange={handleChange}
            className="form-input"
            placeholder={language === 'en' ? 'Enter first name' : 'ആദ്യ പേര് നൽകുക'}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'en' ? 'Last Name' : 'പേരുകളിലെ അവസാനം'}
          </label>
          <input
            type="text"
            name="personalInfo.lastName"
            value={formData.personalInfo.lastName}
            onChange={handleChange}
            className="form-input"
            placeholder={language === 'en' ? 'Enter last name' : 'അവസാന പേര് നൽകുക'}
          />
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderRoleSelection();
      case 2:
        return renderBasicInfo();
      case 3:
        return renderPasswordSection();
      case 4:
        if (formData.role === 'farmer') return renderFarmerFields();
        if (formData.role === 'retailer') return renderRetailerFields();
        if (formData.role === 'laborer') return renderLaborerFields();
        if (formData.role === 'admin') return renderAdminFields();
        return null;
      default:
        return null;
    }
  };

  const getTotalSteps = () => {
    return 4; // role, basic info, password, role-specific
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className={`flex items-center justify-between mb-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <span className="text-sm font-medium">
              {language === 'en' ? `Step ${step} of ${getTotalSteps()}` : `ഘട്ടം ${step} / ${getTotalSteps()}`}
            </span>
            <span className="text-sm">
              {Math.round((step / getTotalSteps()) * 100)}%
            </span>
          </div>
          <div className={`w-full bg-gray-200 rounded-full h-2 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / getTotalSteps()) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'en' ? 'Previous' : 'മുൻപുള്ളത്'}
              </button>

              {step < getTotalSteps() ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                >
                  {language === 'en' ? 'Next' : 'അടുത്തത്'}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      {language === 'en' ? 'Creating Account...' : 'അക്കൗണ്ട് സൃഷ്ടിക്കുന്നു...'}
                    </div>
                  ) : (
                    language === 'en' ? 'Create Account' : 'അക്കൗണ്ട് സൃഷ്ടിക്കുക'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className={`text-center mt-6 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {language === 'en' ? 'Already have an account?' : 'ഇതിനകം ഒരു അക്കൗണ്ട് ഉണ്ടോ?'}{' '}
          <Link
            to="/login"
            className="font-medium text-green-600 hover:text-green-500"
          >
            {language === 'en' ? 'Sign in' : 'ലോഗിൻ ചെയ്യുക'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;