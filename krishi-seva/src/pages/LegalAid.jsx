import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const LegalAid = () => {
  const { language } = useLanguage();
  const [docs, setDocs] = useState([
    { id: 1, name: 'Land Lease Agreement (Template).pdf', type: 'template', date: '2024-01-20' },
    { id: 2, name: 'Fertiliser Purchase Receipt.pdf', type: 'my-doc', date: '2024-01-10' },
    { id: 3, name: 'Crop Insurance Claim Form (Template).docx', type: 'template', date: '2024-01-05' }
  ]);

  const uploadDoc = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const newDoc = { id: Date.now(), name: file.name, type: 'my-doc', date: new Date().toISOString().slice(0,10) };
    setDocs((prev) => [newDoc, ...prev]);
    alert('Document added locally. Connect backend storage for persistence.');
  };

  const card = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)'
  };

  return (
    <div style={{ padding: 'var(--spacing-xxl) 0' }}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>{getTranslation('legalAidTitle', language)}</h1>

        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
          color: 'var(--color-white)', padding: 'var(--spacing-xxl)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--spacing-xxl)', textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>{getTranslation('legalAidHeroTitle', language)}</h2>
          <p style={{ opacity: 0.9, maxWidth: 720, margin: '0 auto' }}>{getTranslation('legalAidHeroSubtitle', language)}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-xl)' }}>
          <div style={{ ...card, padding: 'var(--spacing-xl)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>{getTranslation('templates', language)}</h3>
            <ul style={{ listStyle: 'none' }}>
              {docs.filter(d => d.type === 'template').map((d) => (
                <li key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span>📄 {d.name}</span>
                  <button className="btn-outline">{getTranslation('download', language)}</button>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ ...card, padding: 'var(--spacing-xl)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>{getTranslation('myDocuments', language)}</h3>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label className="btn-primary" style={{ cursor: 'pointer' }}>
                {getTranslation('uploadDocument', language)}
                <input type="file" onChange={uploadDoc} style={{ display: 'none' }} />
              </label>
            </div>
            <ul style={{ listStyle: 'none' }}>
              {docs.filter(d => d.type === 'my-doc').map((d) => (
                <li key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span>📎 {d.name}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-ghost">{getTranslation('preview', language)}</button>
                    <button className="btn-outline">{getTranslation('remove', language)}</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAid;



