import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getTranslation } from '../utils/translations';

// Helper for checkbox options based on schema enums
const cropOptions = ["wheat", "rice", "corn", "vegetables", "fruits", "cotton", "other"];
const skillOptions = ["planting", "harvesting", "irrigation", "pruning", "pest_control", "machine_operation", "packing", "other"];

const Signup = () => {
    const { language } = useLanguage();
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        // Common fields
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'farmer',
        userType: 'farmer',

        // Location (shared by Farmer/Laborer)
        location: {
            state: '',
            district: '',
            address: '', // Used for farmLocation and laborer location
            village: ''
        },

        // Farmer specific
        farmSize: '',
        crops: [],
        certification: 'not-certified',

        // Retailer specific
        businessName: '',
        businessAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
        },
        businessType: 'other',
        licenseNumber: '',
        taxID: '',

        // Laborer specific
        skills: [],
        experience: '',
        availability: 'available',
        alternatePhone: '',
        wageExpectation: {
            daily: '',
            hourly: ''
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setError(''); // Clear error on new input

        // Handle nested state updates
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value },
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRoleChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            role: value,
            userType: value, // Sync role and userType
        }));
    };

    const handleCheckboxChange = (option, field) => {
        setFormData(prev => {
            const currentValues = prev[field];
            if (currentValues.includes(option)) {
                return { ...prev, [field]: currentValues.filter(item => item !== option) };
            } else {
                return { ...prev, [field]: [...currentValues, option] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Role-specific validation
        if (formData.role !== 'retailer' && !formData.name.trim()) {
            setError("Name is required.");
            return;
        }
        if (formData.role === 'retailer' && !formData.businessName.trim()) {
            setError("Business Name is required.");
            return;
        }

        if (!formData.email.trim() && !formData.phone.trim()) {
            setError("Please provide either an email or a phone number.");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // 1. Create a clean base object with common fields
            let submitData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                password: formData.password,
                role: formData.role,
                userType: formData.role,
            };
            
            // 2. Add role-specific data based on the selected role
            if (formData.role === 'farmer') {
                submitData = {
                    ...submitData,
                    farmLocation: {
                        address: formData.location.address,
                        // Placeholder coordinates as per schema
                        coordinates: [0, 0] 
                    },
                    farmSize: formData.farmSize,
                    crops: formData.crops,
                    certification: formData.certification,
                };
            } else if (formData.role === 'retailer') {
                 submitData = {
                    ...submitData,
                    businessName: formData.businessName,
                    businessAddress: {
                        street: formData.businessAddress.street,
                        city: formData.businessAddress.city,
                        state: formData.location.state,
                        zipCode: formData.businessAddress.zipCode,
                        country: 'India'
                    },
                    businessType: formData.businessType,
                    licenseNumber: formData.licenseNumber,
                    taxID: formData.taxID,
                 };
                 // Retailer uses `businessName` instead of `name`
                 delete submitData.name;
            } else if (formData.role === 'laborer') {
                submitData = {
                    ...submitData,
                    skills: formData.skills,
                    experience: formData.experience,
                    availability: formData.availability,
                    alternatePhone: formData.alternatePhone,
                    location: {
                        address: formData.location.address,
                        village: formData.location.village,
                        district: formData.location.district,
                        coordinates: [0, 0]
                    },
                    wageExpectation: {
                        daily: formData.wageExpectation.daily,
                        hourly: formData.wageExpectation.hourly,
                        currency: 'INR'
                    }
                };
            }
            
            // 3. Remove empty optional fields
            if (!submitData.email) delete submitData.email;
            if (!submitData.phone) delete submitData.phone;
            
            await signup(submitData);
            navigate('/dashboard'); // Navigate on success

        } catch (err) {
            setError(err.message || 'Failed to sign up. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Reusable Render Functions for Form Fields ---

    const renderInput = (name, type, placeholder, required = true) => {
        // Handle nested state access
        const value = name.includes('.') 
            ? formData[name.split('.')[0]][name.split('.')[1]] 
            : formData[name];

        return (
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label style={styles.label}>{getTranslation(name, language)} {required && '*'}</label>
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    required={required}
                    style={styles.input}
                />
            </div>
        );
    };

    const renderSelect = (name, options, required = true) => (
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
             <label style={styles.label}>{getTranslation(name, language)} {required && '*'}</label>
             <select name={name} value={formData[name]} onChange={handleInputChange} required={required} style={styles.input}>
                {options.map(opt => (
                    <option key={opt} value={opt}>{getTranslation(opt, language)}</option>
                ))}
             </select>
        </div>
    );
    
    const renderCheckboxGroup = (field, options) => (
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={styles.label}>{getTranslation(field, language)} *</label>
            <div style={styles.checkboxGrid}>
                {options.map(option => (
                    <label key={option} style={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={formData[field].includes(option)}
                            onChange={() => handleCheckboxChange(option, field)}
                        />
                        <span>{getTranslation(option, language)}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    // --- Role Specific Field Renderers ---
    
    const renderFarmerFields = () => (
        <>
            {renderInput('location.address', 'text', 'Enter your full farm address', true)}
            {renderInput('farmSize', 'number', 'e.g., 10 (in acres)', false)}
            {renderCheckboxGroup('crops', cropOptions)}
            {renderSelect('certification', ["not-certified", "organic", "non-organic", "in-transition"], false)}
        </>
    );

    const renderRetailerFields = () => (
        <>
            {renderInput('businessAddress.street', 'text', 'Street name and number', true)}
            {renderInput('businessAddress.city', 'text', 'City name', true)}
            {renderInput('businessAddress.zipCode', 'text', '6-digit postal code', true)}
            {renderSelect('businessType', ["other", "supermarket", "grocery_store", "online_store", "wholesaler", "restaurant"], false)}
            {renderInput('licenseNumber', 'text', 'Enter your business license number', false)}
            {renderInput('taxID', 'text', 'Enter your Tax ID (e.g., GSTIN)', false)}
        </>
    );
    
    const renderLaborerFields = () => (
        <>
            {renderCheckboxGroup('skills', skillOptions)}
            {renderInput('location.address', 'text', 'Enter your full residential address', true)}
            {renderInput('location.village', 'text', 'Your village name', false)}
            {renderInput('experience', 'number', 'e.g., 5 (in years)', false)}
            {renderSelect('availability', ["available", "full_time", "part_time", "seasonal", "not_available"], false)}
            {renderInput('alternatePhone', 'tel', 'Alternate contact number', false)}
            <div style={styles.grid}>
                 {renderInput('wageExpectation.daily', 'number', 'e.g., 500 (per day)', false)}
                 {renderInput('wageExpectation.hourly', 'number', 'e.g., 100 (per hour)', false)}
            </div>
        </>
    );

    return (
        <div style={styles.page}>
            <div className="container">
                <div style={styles.card}>
                    <div style={styles.header}>
                        <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>{getTranslation('createAccount', language)}</h1>
                        <p style={{ color: 'var(--color-text-secondary)' }}>{getTranslation('joinKrishiSeva', language)}</p>
                    </div>

                    {error && <div style={styles.errorBox}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* --- COMMON FIELDS --- */}
                        {formData.role !== 'retailer' ? 
                            renderInput('name', 'text', 'Enter your full name', true) :
                            renderInput('businessName', 'text', 'Enter your business name', true)
                        }
                        {renderInput('email', 'email', 'Enter your email', false)}
                        {renderInput('phone', 'tel', 'Enter your phone number', false)}
                        
                        <div style={styles.grid}>
                            <div>
                                <label style={styles.label}>{getTranslation('state', language)}</label>
                                <input type="text" name="location.state" value={formData.location.state} onChange={handleInputChange} placeholder="e.g., Maharashtra" required style={styles.input} />
                            </div>
                            <div>
                                <label style={styles.label}>{getTranslation('district', language)}</label>
                                <input type="text" name="location.district" value={formData.location.district} onChange={handleInputChange} placeholder="e.g., Pune" required style={styles.input} />
                            </div>
                        </div>

                        {renderInput('password', 'password', 'Enter your password', true)}
                        {renderInput('confirmPassword', 'password', 'Confirm your password', true)}

                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <label style={styles.label}>{getTranslation('role', language)}</label>
                            <select name="role" value={formData.role} onChange={handleRoleChange} required style={styles.input}>
                                <option value="farmer">{getTranslation('roles.farmer', language)}</option>
                                <option value="retailer">{getTranslation('roles.retailer', language)}</option>
                                <option value="laborer">{getTranslation('roles.laborer', language)}</option>
                            </select>
                        </div>
                        
                        <hr style={styles.hr}/>

                        {/* --- DYNAMIC FIELDS --- */}
                        {formData.role === 'farmer' && renderFarmerFields()}
                        {formData.role === 'retailer' && renderRetailerFields()}
                        {formData.role === 'laborer' && renderLaborerFields()}

                        <button type="submit" disabled={isLoading} className="btn-primary" style={styles.submitButton}>
                            {isLoading ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                    <span style={{ marginLeft: 'var(--spacing-sm)' }}>{getTranslation('creatingAccount', language)}...</span>
                                </div>
                            ) : (
                                getTranslation('signup', language)
                            )}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            {getTranslation('alreadyHaveAccount', language)}{' '}
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

// --- STYLES (using CSS variables from your global stylesheet) ---

const styles = {
    page: {
        padding: 'var(--spacing-xxl) 0',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
    },
    card: {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-xxl)',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '600px', // Increased width for larger forms
        width: '100%',
        margin: '0 auto',
    },
    header: {
        textAlign: 'center',
        marginBottom: 'var(--spacing-xl)'
    },
    errorBox: {
        color: 'var(--color-danger)',
        backgroundColor: 'var(--color-danger-light)',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--spacing-lg)',
        textAlign: 'center'
    },
    label: {
        display: 'block',
        marginBottom: 'var(--spacing-xs)',
        fontWeight: '500',
        color: 'var(--color-text-primary)'
    },
    input: {
        width: '100%',
        // Assuming you have global input styles, otherwise add them here
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)'
    },
    checkboxGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 'var(--spacing-md)'
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)'
    },
    hr: {
        border: 'none',
        borderTop: '1px solid var(--color-border)',
        margin: 'var(--spacing-xl) 0'
    },
    submitButton: {
        width: '100%',
        padding: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)'
    }
};

export default Signup;

