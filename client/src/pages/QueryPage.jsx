import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const QueryPage = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
    contactMethod: 'email',
    phone: '',
    email: '',
    location: '',
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Crop Issues',
    'Pest & Disease',
    'Soil Problems',
    'Weather Concerns',
    'Market Information',
    'Government Schemes',
    'Technical Support',
    'Account Issues',
    'General Inquiry'
  ];

  const priorities = [
    { value: 'low', label: 'Low', description: 'General questions' },
    { value: 'medium', label: 'Medium', description: 'Important issues' },
    { value: 'high', label: 'High', description: 'Urgent problems' },
    { value: 'urgent', label: 'Urgent', description: 'Critical issues' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...files]
      });
    }
  };

  const removeAttachment = (index) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: API Endpoint: POST /api/query
    console.log('Query submission:', formData);
    
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const pageStyle = {
    padding: 'var(--spacing-xxl) 0',
    minHeight: '60vh'
  };

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: 'var(--spacing-lg)'
  };

  if (submitted) {
    return (
      <div style={pageStyle}>
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div style={cardStyle}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>✅</div>
              <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Query Submitted Successfully!</h1>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)', lineHeight: '1.6' }}>
                Thank you for contacting us. We have received your query and our support team will get back to you within 24 hours.
              </p>
              <div style={{ backgroundColor: 'var(--color-background)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>What happens next?</h3>
                <ul style={{ textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                  <li>Our expert team will review your query</li>
                  <li>You'll receive an acknowledgment email</li>
                  <li>We'll provide a detailed response within 24 hours</li>
                  <li>Follow-up support will be available if needed</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    category: '',
                    subject: '',
                    description: '',
                    priority: 'medium',
                    contactMethod: 'email',
                    phone: '',
                    email: '',
                    location: '',
                    attachments: []
                  });
                }}
                className="btn-primary"
                style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}
              >
                Submit Another Query
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('queryPage', language)}
        </h1>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Information Card */}
          <div style={cardStyle}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Get Expert Help</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: 'var(--spacing-lg)' }}>
              Our agricultural experts are here to help you with any farming-related questions, issues, or concerns. 
              Fill out the form below and we'll get back to you with personalized advice and solutions.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>⚡</div>
                <h4>Quick Response</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>24-hour response time</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>👨‍🌾</div>
                <h4>Expert Advice</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>From certified agronomists</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🆓</div>
                <h4>Free Support</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>No charges for queries</p>
              </div>
            </div>
          </div>

          {/* Query Form */}
          <div style={cardStyle}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Submit Your Query</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                {/* Category and Priority */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%' }}
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                      Priority *
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%' }}
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label} - {priority.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your query"
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                    Detailed Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Please provide detailed information about your query, including any relevant context, symptoms, or issues you're experiencing..."
                    required
                    rows="6"
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                {/* Contact Information */}
                <div>
                  <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Contact Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                        Preferred Contact Method
                      </label>
                      <select
                        name="contactMethod"
                        value={formData.contactMethod}
                        onChange={handleInputChange}
                        style={{ width: '100%' }}
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Your location (optional)"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Your phone number"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your email address"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* File Attachments */}
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                    Attachments (Optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
                  />
                  {formData.attachments.length > 0 && (
                    <div>
                      <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Uploaded Files:</h4>
                      {formData.attachments.map((file, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 'var(--spacing-sm)',
                          backgroundColor: 'var(--color-background)',
                          borderRadius: 'var(--radius-md)',
                          marginBottom: 'var(--spacing-xs)'
                        }}>
                          <span style={{ fontSize: '0.9rem' }}>📎 {file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-error)',
                              cursor: 'pointer',
                              fontSize: '1.2rem'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: 'var(--spacing-md)', fontSize: '1.1rem' }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                      Submitting Query...
                    </>
                  ) : (
                    'Submit Query'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryPage;


