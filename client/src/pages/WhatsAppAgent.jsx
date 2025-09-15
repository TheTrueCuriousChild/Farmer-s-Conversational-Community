import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const WhatsAppAgent = () => {
  const { language } = useLanguage();
  const sampleLink = 'https://wa.me/919082924664?text=Hello%20KrishiSeva%20Agent';
  return (
    <div style={{ padding: 'var(--spacing-xxl) 0' }}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>{getTranslation('whatsappAgentTitle', language)}</h1>
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-xxl)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>🟢</div>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            {getTranslation('whatsappAgentPrompt', language)}
          </p>
          <a href={sampleLink} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}>
            {getTranslation('whatsappOpenChat', language)}
          </a>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppAgent;



