import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const Profile = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();

  if (!user) {
    // Optional: redirect or show a message if user is not logged in
    return (
        <div style={{ padding: 'var(--spacing-xxl) 0', textAlign: 'center' }}>
            <p>Please log in to view your profile.</p>
        </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-xxl) 0' }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>{getTranslation('profile', language)}</h1>
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-xl)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>{getTranslation(`roles.${user.role}`, language)}</div>
            </div>
          </div>
          <button className="btn-outline" onClick={logout}>
            {getTranslation('logout', language)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
