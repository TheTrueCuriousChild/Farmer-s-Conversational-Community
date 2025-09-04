import React, { useState, useEffect, useRef } from 'react';

// Language translations for UI labels
const translations = {
  en: {
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    googleSignIn: 'Continue with Google',
    dashboard: 'Farmer Portal',
    weather: 'Weather & Alerts',
    mandiPrices: 'Market Prices',
    govSchemes: 'Government Schemes',
    chatbot: 'AI Assistant',
    logout: 'Logout',
    location: 'Enter your location',
    crop: 'Select Crop',
    region: 'Enter Region',
    rice: 'Rice',
    wheat: 'Wheat',
    onion: 'Onion',
    typeMessage: 'Ask me anything about farming...',
    send: 'Send',
    readMore: 'View Details',
    readLess: 'Show Less',
    allowLocation: 'Use My Location',
    loading: 'Loading...',
    error: 'Unable to load data',
    offlineMode: 'Showing cached data',
    temperature: 'Temperature',
    humidity: 'Humidity',
    forecast: 'Forecast',
    alerts: 'Agricultural Alerts',
    commodity: 'Commodity',
    price: 'Price (₹/kg)',
    title: 'Scheme Name',
    description: 'Description',
    welcome: 'Welcome to your farming companion'
  },
  ml: {
    login: 'ലോഗിൻ',
    signup: 'സൈൻ അപ്പ്',
    email: 'ഇമെയിൽ',
    password: 'പാസ്‌വേഡ്',
    name: 'പേര്',
    googleSignIn: 'Google ഉപയോഗിച്ച് തുടരുക',
    dashboard: 'കർഷക പോർട്ടൽ',
    weather: 'കാലാവസ്ഥയും മുന്നറിയിപ്പുകളും',
    mandiPrices: 'മാർക്കറ്റ് വിലകൾ',
    govSchemes: 'സർക്കാർ പദ്ധതികൾ',
    chatbot: 'AI സഹായി',
    logout: 'ലോഗൗട്ട്',
    location: 'നിങ്ങളുടെ സ്ഥലം നൽകുക',
    crop: 'വിള തിരഞ്ഞെടുക്കുക',
    region: 'പ്രദേശം നൽകുക',
    rice: 'അരി',
    wheat: 'ഗോതമ്പ്',
    onion: 'ഉള്ളി',
    typeMessage: 'കൃഷിയെക്കുറിച്ച് എന്തും ചോദിക്കുക...',
    send: 'അയയ്ക്കുക',
    readMore: 'വിശദാംശങ്ങൾ കാണുക',
    readLess: 'കുറച്ച് കാണിക്കുക',
    allowLocation: 'എന്റെ ലൊക്കേഷൻ ഉപയോഗിക്കുക',
    loading: 'ലോഡ് ചെയ്യുന്നു...',
    error: 'ഡാറ്റ ലോഡ് ചെയ്യാൻ കഴിയുന്നില്ല',
    offlineMode: 'കാഷെ ചെയ്ത ഡാറ്റ കാണിക്കുന്നു',
    temperature: 'താപനില',
    humidity: 'ആർദ്രത',
    forecast: 'പ്രവചനം',
    alerts: 'കാർഷിക മുന്നറിയിപ്പുകൾ',
    commodity: 'ചരക്ക്',
    price: 'വില (₹/കിലോ)',
    title: 'പദ്ധതിയുടെ പേര്',
    description: 'വിവരണം',
    welcome: 'നിങ്ങളുടെ കൃഷി സഹായിയിലേക്ക് സ്വാഗതം'
  }
};

function App() {
  // Auth state - using localStorage for demo (production should use httpOnly cookies)
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [isLogin, setIsLogin] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Language state
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  // Dashboard state
  const [weather, setWeather] = useState(null);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [schemes, setSchemesData] = useState([]);
  const [chatMessages, setChatMessages] = useState(() => {
    const cached = localStorage.getItem('chatMessages');
    return cached ? JSON.parse(cached) : [];
  });

  // Form states
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [weatherForm, setWeatherForm] = useState({ lat: '', lon: '', location: '' });
  const [mandiForm, setMandiForm] = useState({ crop: 'rice', region: '' });
  const [schemesForm, setSchemesForm] = useState({ region: '' });
  const [chatInput, setChatInput] = useState('');

  // Loading states
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [mandiLoading, setMandiLoading] = useState(false);
  const [schemesLoading, setSchemesLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // Error states
  const [weatherError, setWeatherError] = useState('');
  const [mandiError, setMandiError] = useState('');
  const [schemesError, setSchemesError] = useState('');

  // Expanded schemes state
  const [expandedSchemes, setExpandedSchemes] = useState({});

  const chatEndRef = useRef(null);

  // API helper function - calls backend endpoints
  const apiCall = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    };

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  };

  // Authentication functions
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin 
        ? { email: authForm.email, password: authForm.password }
        : { name: authForm.name, email: authForm.email, password: authForm.password };

      const data = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      // Store auth token and user info (production should use httpOnly cookies)
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuthToken(data.token);
      setUser(data.user);
    } catch (error) {
      alert('Authentication failed: ' + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Google Sign-In (UI only - real implementation needs Google client library)
  const handleGoogleSignIn = async () => {
    try {
      // TODO: Implement real Google OAuth flow with Google client library
      // This is a placeholder - real implementation would get idToken from Google SDK
      const idToken = 'placeholder_google_token';
      
      const data = await apiCall('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ idToken })
      });

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuthToken(data.token);
      setUser(data.user);
    } catch (error) {
      alert('Google sign-in failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
  };

  // Get user location using browser geolocation API
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setWeatherForm({
            ...weatherForm,
            lat: position.coords.latitude.toString(),
            lon: position.coords.longitude.toString()
          });
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setWeatherError('Unable to get location. Please enter manually.');
        }
      );
    } else {
      setWeatherError('Geolocation not supported. Please enter location manually.');
    }
  };

  // Weather API call
  const fetchWeather = async (lat, lon) => {
    setWeatherLoading(true);
    setWeatherError('');

    try {
      const data = await apiCall(`/api/weather?lat=${lat}&lon=${lon}&lang=${language}`);
      setWeather(data);
      // Cache weather data for offline use
      localStorage.setItem('weatherData', JSON.stringify(data));
    } catch (error) {
      setWeatherError(t.error);
      // Try to use cached data
      const cached = localStorage.getItem('weatherData');
      if (cached) {
        setWeather(JSON.parse(cached));
        setWeatherError(t.offlineMode);
      }
    } finally {
      setWeatherLoading(false);
    }
  };

  // Mandi prices API call
  const fetchMandiPrices = async () => {
    if (!mandiForm.region) return;
    
    setMandiLoading(true);
    setMandiError('');

    try {
      const data = await apiCall(`/api/mandi?crop=${mandiForm.crop}&region=${mandiForm.region}`);
      setMandiPrices(data.prices || []);
      localStorage.setItem('mandiData', JSON.stringify(data.prices || []));
    } catch (error) {
      setMandiError(t.error);
      // Try to use cached data
      const cached = localStorage.getItem('mandiData');
      if (cached) {
        setMandiPrices(JSON.parse(cached));
        setMandiError(t.offlineMode);
      }
    } finally {
      setMandiLoading(false);
    }
  };

  // Government schemes API call
  const fetchSchemes = async () => {
    if (!schemesForm.region) return;
    
    setSchemesLoading(true);
    setSchemesError('');

    try {
      const data = await apiCall(`/api/schemes?region=${schemesForm.region}&lang=${language}`);
      setSchemesData(data.schemes || []);
      localStorage.setItem('schemesData', JSON.stringify(data.schemes || []));
    } catch (error) {
      setSchemesError(t.error);
      // Try to use cached data
      const cached = localStorage.getItem('schemesData');
      if (cached) {
        setSchemesData(JSON.parse(cached));
        setSchemesError(t.offlineMode);
      }
    } finally {
      setSchemesLoading(false);
    }
  };

  // Chat API call
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { type: 'user', message: chatInput, timestamp: Date.now() };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const data = await apiCall('/api/chat/query', {
        method: 'POST',
        body: JSON.stringify({ question: chatInput, lang: language })
      });

      const botMessage = { 
        type: 'bot', 
        message: data.answer, 
        evidence: data.evidence,
        timestamp: Date.now() 
      };
      
      const updatedMessages = [...newMessages, botMessage];
      // Keep only last 20 messages for performance and storage
      const limitedMessages = updatedMessages.slice(-20);
      setChatMessages(limitedMessages);
      localStorage.setItem('chatMessages', JSON.stringify(limitedMessages));
    } catch (error) {
      const errorMessage = { 
        type: 'bot', 
        message: 'Sorry, I encountered an error. Please try again later.',
        timestamp: Date.now() 
      };
      setChatMessages([...newMessages, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Toggle scheme expansion
  const toggleScheme = (index) => {
    setExpandedSchemes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Authentication UI with modern design
  if (!authToken) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            * { 
              box-sizing: border-box; 
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              line-height: 1.6;
            }
            
            .auth-page {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
              position: relative;
            }
            
            .lang-toggle {
              position: absolute;
              top: 24px;
              right: 24px;
              background: rgba(255, 255, 255, 0.2);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.3);
              color: white;
              padding: 8px 16px;
              border-radius: 25px;
              font-weight: 500;
              transition: all 0.3s ease;
            }
            
            .lang-toggle:hover {
              background: rgba(255, 255, 255, 0.3);
              transform: translateY(-2px);
            }
            
            .auth-container {
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(20px);
              padding: 48px;
              border-radius: 24px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              width: 100%;
              max-width: 440px;
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .auth-title {
              text-align: center;
              font-size: 32px;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 8px;
            }
            
            .auth-subtitle {
              text-align: center;
              color: #6b7280;
              margin-bottom: 32px;
              font-weight: 400;
            }
            
            .form-group {
              margin-bottom: 20px;
            }
            
            .form-label {
              display: block;
              font-weight: 500;
              color: #374151;
              margin-bottom: 6px;
              font-size: 14px;
            }
            
            .form-input {
              width: 100%;
              padding: 16px;
              border: 2px solid #e5e7eb;
              border-radius: 12px;
              font-size: 16px;
              transition: all 0.2s ease;
              background: #fff;
            }
            
            .form-input:focus {
              outline: none;
              border-color: #3b82f6;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .btn {
              width: 100%;
              padding: 16px;
              border: none;
              border-radius: 12px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            }
            
            .btn-primary {
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              margin-bottom: 16px;
            }
            
            .btn-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
            }
            
            .btn-google {
              background: #fff;
              color: #374151;
              border: 2px solid #e5e7eb;
              margin-bottom: 24px;
            }
            
            .btn-google:hover {
              background: #f9fafb;
              border-color: #d1d5db;
              transform: translateY(-1px);
            }
            
            .divider {
              display: flex;
              align-items: center;
              margin: 24px 0;
              color: #9ca3af;
              font-size: 14px;
            }
            
            .divider::before,
            .divider::after {
              content: '';
              flex: 1;
              height: 1px;
              background: #e5e7eb;
            }
            
            .divider span {
              padding: 0 16px;
            }
            
            .toggle-link {
              text-align: center;
              color: #3b82f6;
              font-weight: 500;
              cursor: pointer;
              text-decoration: none;
              padding: 8px;
            }
            
            .toggle-link:hover {
              text-decoration: underline;
            }
          `}
        </style>

        <div className="auth-page">
          <button 
            className="lang-toggle"
            onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
          >
            {language === 'en' ? 'മലയാളം' : 'English'}
          </button>

          <div className="auth-container">
            <h1 className="auth-title">{isLogin ? t.login : t.signup}</h1>
            <p className="auth-subtitle">{t.welcome}</p>

            <button className="btn btn-google" onClick={handleGoogleSignIn}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t.googleSignIn}
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <form onSubmit={handleAuth}>
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">{t.name}</label>
                  <input
                    className="form-input"
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">{t.email}</label>
                <input
                  className="form-input"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.password}</label>
                <input
                  className="form-input"
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={authLoading}
              >
                {authLoading ? t.loading : (isLogin ? t.login : t.signup)}
              </button>
            </form>

            <div className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard UI with modern card-based design
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * { 
            box-sizing: border-box; 
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
          }
          
          .header {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            color: white;
            padding: 20px 32px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          
          .header-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .header-title {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
          }
          
          .header-actions {
            display: flex;
            gap: 16px;
            align-items: center;
          }
          
          .user-info {
            font-weight: 500;
            opacity: 0.9;
          }
          
          .lang-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
          }
          
          .logout-btn {
            background: rgba(220, 38, 38, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 500;
          }
          
          .dashboard-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 32px;
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 32px;
          }
          
          .left-panels {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          
          .panel {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
          }
          
          .panel:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          }
          
          .panel-title {
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .panel-icon {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .weather-icon { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); }
          .market-icon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
          .schemes-icon { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
          .chat-icon { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
          
          .form-row {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }
          
          .form-input, .form-select {
            padding: 14px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 14px;
            transition: all 0.2s ease;
            background: #fff;
            font-family: inherit;
          }
          
          .form-input:focus, .form-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .btn-action {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            padding: 14px 24px;
            border-radius: 12px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .btn-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
          }
          
          .btn-location {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 14px 20px;
            border-radius: 12px;
            font-weight: 600;
            white-space: nowrap;
          }
          
          .weather-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 16px;
          }
          
          .weather-card {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 16px;
            border-radius: 12px;
            border: 1px solid rgba(59, 130, 246, 0.1);
          }
          
          .weather-value {
            font-size: 24px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 4px;
          }
          
          .weather-label {
            font-size: 14px;
            color: #6b7280;
            font-weight: 500;
          }
          
          .market-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          
          .market-table th {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 16px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .market-table td {
            padding: 16px;
            border-bottom: 1px solid #f1f5f9;
            color: #4b5563;
          }
          
          .market-table tr:hover {
            background: #f8fafc;
          }
          
          .price-value {
            font-weight: 600;
            color: #059669;
            font-size: 16px;
          }
          
          .scheme-card {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 16px;
            transition: all 0.3s ease;
          }
          
          .scheme-card:hover {
            border-color: #3b82f6;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
          }
          
          .scheme-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }
          
          .scheme-description {
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 12px;
          }
          
          .scheme-toggle {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 500;
          }
          
          .chat-panel {
            height: calc(100vh - 140px);
            display: flex;
            flex-direction: column;
          }
          
          .chat-messages {
            flex: 1;
            overflow-y: auto;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 20px;
            scroll-behavior: smooth;
          }
          
          .chat-messages::-webkit-scrollbar {
            width: 6px;
          }
          
          .chat-messages::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }
          
          .chat-messages::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }
          
          .message {
            margin-bottom: 16px;
            animation: fadeIn 0.3s ease;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .message-bubble {
            padding: 16px 20px;
            border-radius: 18px;
            max-width: 85%;
            word-wrap: break-word;
          }
          
          .message.user .message-bubble {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 6px;
          }
          
          .message.bot .message-bubble {
            background: #fff;
            color: #374151;
            border: 1px solid #e5e7eb;
            border-bottom-left-radius: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }
          
          .message-evidence {
            font-size: 12px;
            opacity: 0.7;
            margin-top: 8px;
            font-style: italic;
          }
          
          .chat-form {
            display: flex;
            gap: 12px;
            align-items: end;
          }
          
          .chat-input {
            flex: 1;
            padding: 16px 20px;
            border: 2px solid #e5e7eb;
            border-radius: 25px;
            font-size: 16px;
            resize: none;
            min-height: 50px;
            max-height: 120px;
            margin: 0;
          }
          
          .chat-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .chat-send {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 25px;
            font-weight: 600;
            min-width: 80px;
          }
          
          .loading-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #6b7280;
            font-style: italic;
            margin: 16px 0;
          }
          
          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #e5e7eb;
            border-top: 2px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .error-message {
            color: #dc2626;
            background: #fef2f2;
            border: 1px solid #fecaca;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            margin: 12px 0;
          }
          
          .offline-indicator {
            color: #f59e0b;
            background: #fffbeb;
            border: 1px solid #fed7aa;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            margin: 12px 0;
          }
          
          @media (max-width: 1024px) {
            .dashboard-container {
              grid-template-columns: 1fr;
              padding: 20px;
              gap: 24px;
            }
            
            .chat-panel {
              height: 500px;
            }
          }
          
          @media (max-width: 768px) {
            .header-content {
              flex-direction: column;
              gap: 16px;
              text-align: center;
            }
            
            .header-actions {
              flex-wrap: wrap;
              justify-content: center;
            }
            
            .dashboard-container {
              padding: 16px;
            }
            
            .form-row {
              flex-direction: column;
            }
            
            .weather-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1 className="header-title">{t.dashboard}</h1>
          <div className="header-actions">
            <span className="user-info">{user?.name || user?.email}</span>
            <button 
              className="lang-btn"
              onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
            >
              {language === 'en' ? 'മലയാളം' : 'English'}
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              {t.logout}
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard-container">
        {/* Left Column - Data Panels */}
        <div className="left-panels">
          {/* Weather Panel */}
          <div className="panel">
            <h3 className="panel-title">
              <div className="panel-icon weather-icon">🌤️</div>
              {t.weather}
            </h3>
            
            <div className="form-row">
              <button className="btn-location" onClick={getUserLocation}>
                📍 {t.allowLocation}
              </button>
              <input
                className="form-input"
                type="text"
                placeholder={t.location}
                value={weatherForm.location}
                onChange={(e) => setWeatherForm({...weatherForm, location: e.target.value})}
                style={{ flex: 1 }}
              />
            </div>
            
            {weatherLoading && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                {t.loading}
              </div>
            )}
            
            {weatherError && (
              <div className={weatherError.includes('cached') ? 'offline-indicator' : 'error-message'}>
                {weatherError}
              </div>
            )}
            
            {weather && (
              <div className="weather-grid">
                <div className="weather-card">
                  <div className="weather-value">{weather.temperature}°C</div>
                  <div className="weather-label">{t.temperature}</div>
                </div>
                <div className="weather-card">
                  <div className="weather-value">{weather.humidity}%</div>
                  <div className="weather-label">{t.humidity}</div>
                </div>
                <div className="weather-card" style={{ gridColumn: 'span 2' }}>
                  <div className="weather-label">{t.forecast}</div>
                  <div style={{ color: '#1f2937', fontWeight: '500', marginTop: '4px' }}>
                    {weather.forecast}
                  </div>
                  {weather.agriAlerts && (
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '12px', 
                      background: '#fef2f2', 
                      borderRadius: '8px',
                      border: '1px solid #fecaca'
                    }}>
                      <strong style={{ color: '#dc2626' }}>{t.alerts}:</strong>
                      <div style={{ color: '#7f1d1d', marginTop: '4px' }}>{weather.agriAlerts}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mandi Prices Panel */}
          <div className="panel">
            <h3 className="panel-title">
              <div className="panel-icon market-icon">📊</div>
              {t.mandiPrices}
            </h3>
            
            <div className="form-row">
              <select
                className="form-select"
                value={mandiForm.crop}
                onChange={(e) => setMandiForm({...mandiForm, crop: e.target.value})}
              >
                <option value="rice">{t.rice}</option>
                <option value="wheat">{t.wheat}</option>
                <option value="onion">{t.onion}</option>
              </select>
              <input
                className="form-input"
                type="text"
                placeholder={t.region}
                value={mandiForm.region}
                onChange={(e) => setMandiForm({...mandiForm, region: e.target.value})}
                style={{ flex: 1 }}
              />
              <button className="btn-action" onClick={fetchMandiPrices}>
                🔍 Search
              </button>
            </div>

            {mandiLoading && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                {t.loading}
              </div>
            )}
            
            {mandiError && (
              <div className={mandiError.includes('cached') ? 'offline-indicator' : 'error-message'}>
                {mandiError}
              </div>
            )}

            {mandiPrices.length > 0 && (
              <table className="market-table">
                <thead>
                  <tr>
                    <th>{t.commodity}</th>
                    <th>{t.price}</th>
                  </tr>
                </thead>
                <tbody>
                  {mandiPrices.map((item, index) => (
                    <tr key={index}>
                      <td>{item.commodity}</td>
                      <td className="price-value">₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Government Schemes Panel */}
          <div className="panel">
            <h3 className="panel-title">
              <div className="panel-icon schemes-icon">🏛️</div>
              {t.govSchemes}
            </h3>
            
            <div className="form-row">
              <input
                className="form-input"
                type="text"
                placeholder={t.region}
                value={schemesForm.region}
                onChange={(e) => setSchemesForm({...schemesForm, region: e.target.value})}
                style={{ flex: 1 }}
              />
              <button className="btn-action" onClick={fetchSchemes}>
                🔍 Search
              </button>
            </div>

            {schemesLoading && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                {t.loading}
              </div>
            )}
            
            {schemesError && (
              <div className={schemesError.includes('cached') ? 'offline-indicator' : 'error-message'}>
                {schemesError}
              </div>
            )}

            {schemes.map((scheme, index) => (
              <div key={index} className="scheme-card">
                <h4 className="scheme-title">{scheme.title}</h4>
                <div className="scheme-description">
                  {expandedSchemes[index] ? scheme.description : `${scheme.description?.slice(0, 120)}...`}
                </div>
                <button 
                  className="scheme-toggle"
                  onClick={() => toggleScheme(index)}
                >
                  {expandedSchemes[index] ? t.readLess : t.readMore}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - AI Chat */}
        <div className="panel chat-panel">
          <h3 className="panel-title">
            <div className="panel-icon chat-icon">🤖</div>
            {t.chatbot}
          </h3>
          
          <div className="chat-messages">
            {chatMessages.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                color: '#9ca3af', 
                marginTop: '40px',
                fontStyle: 'italic'
              }}>
                Start a conversation about farming, weather, or government schemes...
              </div>
            )}
            
            {chatMessages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-bubble">
                  <div>{msg.message}</div>
                  {msg.evidence && (
                    <div className="message-evidence">
                      📚 Source: {msg.evidence}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {chatLoading && (
              <div className="message bot">
                <div className="message-bubble">
                  <div className="loading-indicator">
                    <div className="spinner"></div>
                    {t.loading}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChatSubmit} className="chat-form">
            <textarea
              className="chat-input"
              placeholder={t.typeMessage}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading}
              rows="1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleChatSubmit(e);
                }
              }}
            />
            <button 
              type="submit" 
              className="chat-send"
              disabled={chatLoading || !chatInput.trim()}
            >
              ✈️ {t.send}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;