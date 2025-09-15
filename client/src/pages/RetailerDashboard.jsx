import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const RetailerDashboard = () => {
  const { language } = useLanguage();
  return (
    <div style={{ padding: 'var(--spacing-xxl) 0' }}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('dashboardOverview', language)} - {getTranslation('roles.retailer', language)}
        </h1>
        {/* Add highly customized retailer dashboard content here */}
        <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>
          {getTranslation('welcomeToKrishiSeva', language)}<br/>
          {/* Example: Show trending crops to buy, market analytics, etc. */}
          <p style={{ marginTop: 32 }}>Your personalized retail insights and recommendations will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;
