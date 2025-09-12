import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const DiseaseChecker = () => {
  const { language } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) { // 5MB limit
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file smaller than 5MB');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    // TODO: API Endpoint: POST /api/disease-check
    console.log('Analyzing image:', selectedFile.name);
    
    // Mock analysis result
    setTimeout(() => {
      setResult({
        disease: 'Leaf Blight',
        confidence: 85,
        description: 'This appears to be a fungal infection affecting the leaves. Common in humid conditions.',
        treatment: [
          'Remove affected leaves immediately',
          'Apply fungicide spray every 7-10 days',
          'Improve air circulation around plants',
          'Avoid overhead watering'
        ],
        prevention: [
          'Plant resistant varieties',
          'Maintain proper spacing',
          'Water at soil level',
          'Regular crop rotation'
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
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

  return (
    <div style={pageStyle}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('diseaseChecker', language)}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-xl)' }}>
          {/* Upload Section */}
          <div style={cardStyle}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Upload Plant Image</h2>
            
            <div style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-xxl)',
              textAlign: 'center',
              marginBottom: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-background)'
            }}>
              {preview ? (
                <div>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px', 
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--spacing-md)'
                    }} 
                  />
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    {selectedFile?.name}
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📷</div>
                  <p style={{ marginBottom: 'var(--spacing-md)' }}>
                    Drag and drop an image here, or click to select
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    Supported formats: JPEG, PNG (Max 5MB)
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileSelect}
              style={{ marginBottom: 'var(--spacing-lg)' }}
            />

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className="btn-primary"
              style={{ width: '100%', padding: 'var(--spacing-md)' }}
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                  Analyzing...
                </>
              ) : (
                'Analyze Disease'
              )}
            </button>
          </div>

          {/* Results Section */}
          <div style={cardStyle}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Analysis Results</h2>
            
            {result ? (
              <div>
                <div style={{
                  backgroundColor: 'var(--color-warning)',
                  color: 'var(--color-white)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--spacing-lg)',
                  textAlign: 'center'
                }}>
                  <h3 style={{ margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                    {result.disease}
                  </h3>
                  <p style={{ margin: 0, opacity: 0.9 }}>
                    Confidence: {result.confidence}%
                  </p>
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <h4>Description:</h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    {result.description}
                  </p>
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <h4>Treatment:</h4>
                  <ul style={{ paddingLeft: 'var(--spacing-lg)' }}>
                    {result.treatment.map((item, index) => (
                      <li key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>Prevention:</h4>
                  <ul style={{ paddingLeft: 'var(--spacing-lg)' }}>
                    {result.prevention.map((item, index) => (
                      <li key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🔍</div>
                <p>Upload an image to get started with disease analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div style={cardStyle}>
          <h2>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>📸</div>
              <h4>1. Upload Image</h4>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Take a clear photo of the affected plant part
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>🤖</div>
              <h4>2. AI Analysis</h4>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Our AI analyzes the image for disease patterns
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>💡</div>
              <h4>3. Get Results</h4>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Receive diagnosis and treatment recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseChecker;


