import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const CallingAgent = () => {
  const { language } = useLanguage();
  return (
    <div style={{ padding: 'var(--spacing-xxl) 0' }}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('callingAgent.title', language)}
        </h1>
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-xxl)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>📞</div>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            {getTranslation('callingAgent.description', language)}
          </p>
          <button className="btn-primary" style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}>
            {getTranslation('callingAgent.callNow', language)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallingAgent;







