import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';
import { mockLedgerEntries } from '../mock/mockData';

const InformationLedger = () => {
  const { language } = useLanguage();
  const [entries, setEntries] = useState(mockLedgerEntries);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = entries.filter((e) =>
    (filter === 'all' || e.category.toLowerCase() === filter) &&
    (query.trim() === '' || (
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.summary.toLowerCase().includes(query.toLowerCase()) ||
      e.tags.join(' ').toLowerCase().includes(query.toLowerCase())
    ))
  );

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
  };

  return (
    <div style={{ padding: 'var(--spacing-xxl) 0' }}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('informationLedger', language)}
        </h1>

        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
          color: 'var(--color-white)',
          padding: 'var(--spacing-xxl)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          marginBottom: 'var(--spacing-xxl)'
        }}>
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>{getTranslation('ledger.heroTitle', language)}</h2>
          <p style={{ opacity: 0.9, maxWidth: 700, margin: '0 auto' }}>{getTranslation('ledger.heroSubtitle', language)}</p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', marginBottom: 'var(--spacing-xl)' }}>
          <input
            type="text"
            placeholder={getTranslation('ledger.searchPlaceholder', language)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, minWidth: 240 }}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">{getTranslation('all', language)}</option>
            <option value="wisdom">{getTranslation('ledger.wisdom', language)}</option>
            <option value="guidance">{getTranslation('ledger.guidance', language)}</option>
            <option value="insight">{getTranslation('ledger.insight', language)}</option>
          </select>
          <button className="btn-primary">{getTranslation('ledger.addEntry', language)}</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-xl)' }}>
          {filtered.map((entry) => (
            <div key={entry.id} style={cardStyle} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                <h3 style={{ margin: 0 }}>{entry.title}</h3>
                <span style={{ padding: '2px 8px', borderRadius: '12px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', fontSize: 12, textTransform: 'capitalize' }}>{entry.category}</span>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>{entry.summary}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 'var(--spacing-sm)' }}>
                {entry.tags.map((t) => (
                  <span key={t} style={{ fontSize: 12, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '2px 8px' }}>#{t}</span>
                ))}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>📅 {entry.date}</div>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                <button className="btn-outline">{getTranslation('save', language)}</button>
                <button className="btn-ghost">{getTranslation('view', language)}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InformationLedger;


