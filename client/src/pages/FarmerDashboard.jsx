import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const FarmerDashboard = () => {
  const { language } = useLanguage();

  // Check user role from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {}

  if (!user || user.role !== 'farmer') {
    return (
      <div
        style={{
          padding: 'var(--spacing-xxl) 0',
          textAlign: 'center',
          color: '#fff',
          backgroundColor: '#000',
          minHeight: '80vh',
        }}
      >
        <h2>Access Denied</h2>
        <p>This dashboard is only for farmers.</p>
      </div>
    );
  }

  // Hardcoded dark mode colors
  const bgColor = '#000';
  const textColor = '#fff';
  const cardBg = '#1a1a1a';
  const placeholderBg = '#333';

  return (
    <div style={{ padding: 'var(--spacing-xxl) 0', backgroundColor: bgColor, minHeight: '80vh', color: textColor }}>
      <div className="container">
        {/* Dashboard Header */}
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('dashboardOverview', language)} - {getTranslation('roles.farmer', language)}
        </h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: 48 }}>
          {getTranslation('welcomeToKrishiSeva', language)}, {user.name || 'Farmer'}!
        </p>

        {/* Quick Stats Section */}
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginBottom: 48 }}>
          <div style={{ ...statCardStyle, backgroundColor: cardBg, color: textColor }}>🌾 Trending Crops: Wheat, Rice, Corn</div>
          <div style={{ ...statCardStyle, backgroundColor: cardBg, color: textColor }}>📅 Farm Tasks: Plowing, Sowing, Irrigation</div>
          <div style={{ ...statCardStyle, backgroundColor: cardBg, color: textColor }}>💰 Market Price: ₹ 2400 / quintal</div>
        </div>

        {/* Farm Planning Section */}
        <div style={{ ...sectionStyle, backgroundColor: cardBg, color: textColor }}>
          <h2>Farm Planning</h2>
          <p>Plan your crop cycles, irrigation schedules, and harvesting timeline efficiently.</p>
          <div style={{ ...placeholderBox, backgroundColor: placeholderBg }}>[Farm planning chart / calendar placeholder]</div>
        </div>

        {/* Notifications Section */}
        <div style={{ ...sectionStyle, backgroundColor: cardBg, color: textColor }}>
          <h2>Notifications</h2>
          <ul style={{ listStyle: 'disc inside' }}>
            <li>Government subsidy application due next week.</li>
            <li>Weather alert: Heavy rainfall expected tomorrow.</li>
            <li>New farming techniques available in your region.</li>
          </ul>
        </div>

        {/* Insights Section */}
        <div style={{ ...sectionStyle, backgroundColor: cardBg, color: textColor }}>
          <h2>Insights</h2>
          <p>Receive personalized farming recommendations based on your crops and region.</p>
          <div style={{ ...placeholderBox, backgroundColor: placeholderBg }}>[Insights chart placeholder]</div>
        </div>
      </div>
    </div>
  );
};

// Shared styles
const statCardStyle = {
  padding: 24,
  borderRadius: 12,
  width: '250px',
  textAlign: 'center',
  marginBottom: 16,
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const sectionStyle = {
  padding: 24,
  borderRadius: 12,
  marginBottom: 32,
  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
};

const placeholderBox = {
  height: 150,
  borderRadius: 8,
  marginTop: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontStyle: 'italic',
  color: '#ccc',
};

export default FarmerDashboard;
