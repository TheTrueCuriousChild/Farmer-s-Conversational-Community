import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const LabourerDashboard = () => {
  const { language } = useLanguage();
  return (
    <div style={{ padding: 'var(--spacing-xxl) 0' }}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('dashboardOverview', language)} - {getTranslation('roles.labourer', language)}
        </h1>
        {/* Add highly customized labourer dashboard content here */}
        <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>
          {getTranslation('welcomeToKrishiSeva', language)}<br/>
          {/* Example: Show job opportunities, work history, etc. */}
          <p style={{ marginTop: 32 }}>Your personalized labour insights and recommendations will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default LabourerDashboard;
