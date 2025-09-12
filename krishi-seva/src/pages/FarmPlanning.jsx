import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const FarmPlanning = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    location: '',
    crop: '',
    season: '',
    area: '',
    soilType: '',
    irrigation: '',
    budget: '',
    experience: ''
  });
  const [results, setResults] = useState(null);
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
    
    // TODO: API Endpoint: POST /api/farm-planning
    console.log('Farm planning data:', formData);
    
    // Mock results
    setTimeout(() => {
      setResults({
        recommendations: [
          {
            title: 'Optimal Planting Time',
            description: 'Based on your location and season, plant between March 15-30 for best results.',
            priority: 'high'
          },
          {
            title: 'Soil Preparation',
            description: 'Add organic compost and ensure proper drainage. Test soil pH and adjust if needed.',
            priority: 'high'
          },
          {
            title: 'Irrigation Schedule',
            description: 'Water every 3-4 days during initial growth, then weekly during maturity.',
            priority: 'medium'
          },
          {
            title: 'Fertilizer Plan',
            description: 'Apply NPK 19:19:19 at planting, then nitrogen-rich fertilizer after 30 days.',
            priority: 'medium'
          },
          {
            title: 'Pest Management',
            description: 'Monitor for common pests. Use organic pesticides as preventive measure.',
            priority: 'low'
          }
        ],
        estimatedYield: '2.5-3.0 tons per acre',
        estimatedCost: '₹45,000-₹55,000 per acre',
        profitPotential: '₹80,000-₹1,20,000 per acre'
      });
      setIsLoading(false);
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

  const weatherWidgetStyle = {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-white)',
    padding: 'var(--spacing-lg)',
    borderRadius: 'var(--radius-lg)',
    textAlign: 'center'
  };

  return (
    <div style={pageStyle}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('farmPlanning', language)}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-xl)' }}>
          {/* Planning Form */}
          <div style={cardStyle}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Farm Planning Form</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter your farm location"
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                    Crop Type *
                  </label>
                  <select
                    name="crop"
                    value={formData.crop}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%' }}
                  >
                    <option value="">Select crop</option>
                    <option value="rice">Rice</option>
                    <option value="wheat">Wheat</option>
                    <option value="maize">Maize</option>
                    <option value="sugarcane">Sugarcane</option>
                    <option value="cotton">Cotton</option>
                    <option value="tomato">Tomato</option>
                    <option value="onion">Onion</option>
                    <option value="potato">Potato</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                    Season *
                  </label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%' }}
                  >
                    <option value="">Select season</option>
                    <option value="kharif">Kharif (Monsoon)</option>
                    <option value="rabi">Rabi (Winter)</option>
                    <option value="zaid">Zaid (Summer)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                    Farm Area (acres) *
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Enter farm area in acres"
                    required
                    min="0.1"
                    step="0.1"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                    Soil Type
                  </label>
                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleInputChange}
                    style={{ width: '100%' }}
                  >
                    <option value="">Select soil type</option>
                    <option value="clay">Clay</option>
                    <option value="sandy">Sandy</option>
                    <option value="loamy">Loamy</option>
                    <option value="silty">Silty</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                    Irrigation Type
                  </label>
                  <select
                    name="irrigation"
                    value={formData.irrigation}
                    onChange={handleInputChange}
                    style={{ width: '100%' }}
                  >
                    <option value="">Select irrigation</option>
                    <option value="rainfed">Rainfed</option>
                    <option value="drip">Drip Irrigation</option>
                    <option value="sprinkler">Sprinkler</option>
                    <option value="flood">Flood Irrigation</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                    Budget (₹)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="Enter your budget"
                    min="0"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                    Farming Experience
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    style={{ width: '100%' }}
                  >
                    <option value="">Select experience</option>
                    <option value="beginner">Beginner (0-2 years)</option>
                    <option value="intermediate">Intermediate (3-10 years)</option>
                    <option value="expert">Expert (10+ years)</option>
                  </select>
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
                    Generating Plan...
                  </>
                ) : (
                  'Generate Farm Plan'
                )}
              </button>
            </form>
          </div>

          {/* Weather Widget */}
          <div style={weatherWidgetStyle}>
            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Current Weather</h3>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>☀️</div>
            <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>28°C</h2>
            <p style={{ marginBottom: 'var(--spacing-lg)', opacity: 0.9 }}>Partly Cloudy</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
              <div>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>Humidity</p>
                <p style={{ fontSize: '1.2rem', margin: 0 }}>65%</p>
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>Wind</p>
                <p style={{ fontSize: '1.2rem', margin: 0 }}>12 km/h</p>
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>Rain</p>
                <p style={{ fontSize: '1.2rem', margin: 0 }}>0%</p>
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>7-Day Forecast</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Mon: 30°C ☀️</span>
                <span>Tue: 28°C ⛅</span>
                <span>Wed: 26°C 🌧️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div style={cardStyle}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Your Farm Plan</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
              <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>Estimated Yield</h4>
                <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{results.estimatedYield}</p>
              </div>
              <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>Estimated Cost</h4>
                <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{results.estimatedCost}</p>
              </div>
              <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>Profit Potential</h4>
                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--color-success)' }}>{results.profitPotential}</p>
              </div>
            </div>

            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Recommendations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {results.recommendations.map((rec, index) => (
                <div key={index} style={{
                  padding: 'var(--spacing-md)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-background)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                    <h4 style={{ margin: 0 }}>{rec.title}</h4>
                    <span style={{
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      backgroundColor: rec.priority === 'high' ? 'var(--color-error)' : 
                                       rec.priority === 'medium' ? 'var(--color-warning)' : 'var(--color-info)',
                      color: 'var(--color-white)'
                    }}>
                      {rec.priority}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmPlanning;


