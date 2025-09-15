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
      <div style={{ padding: 'var(--spacing-xxl) 0', textAlign: 'center', color: 'var(--color-error)' }}>
        <h2>Access Denied</h2>
        <p>This dashboard is only for farmers.</p>
      </div>
    );
  }
  return (
    <div style={{ padding: 'var(--spacing-xxl) 0' }}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('dashboardOverview', language)} - {getTranslation('roles.farmer', language)}
        </h1>
        {/* Add highly customized farmer dashboard content here */}
        <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>
          {getTranslation('welcomeToKrishiSeva', language)}<br/>
          {/* Example: Show trending crops, farm planning, etc. */}
          <p style={{ marginTop: 32 }}>Your personalized farming insights and recommendations will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
