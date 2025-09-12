import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const NavItem = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: '8px',
        color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
        backgroundColor: isActive ? 'var(--color-surface)' : 'transparent',
        textDecoration: 'none'
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <span style={{ fontWeight: 500 }}>{label}</span>
    </Link>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const { language } = useLanguage();

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '260px',
    backgroundColor: 'var(--color-background)',
    borderRight: '1px solid var(--color-border)',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
    zIndex: 1100,
    transform: isOpen ? 'translateX(0)' : 'translateX(-105%)',
    transition: 'transform var(--transition-normal)'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  };

  return (
    <aside style={containerStyle} aria-label="Sidebar navigation">
      <div style={headerStyle}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #2E7D32, #66BB6A)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
        }}>🌿</div>
        <div>
          <div style={{ fontWeight: 700 }}>Krishi Seva</div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Smart Agriculture Platform</div>
        </div>
      </div>

      <div style={{ color: 'var(--color-primary)', fontWeight: 700, margin: '12px 0' }}>{getTranslation('navigation', language) || 'NAVIGATION'}</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <NavItem to="/" icon="🏠" label={getTranslation('home', language)} />
        <NavItem to="/admin-dashboard" icon="📊" label={getTranslation('dashboard', language)} />
        <NavItem to="/farm-planning" icon="📅" label={getTranslation('farmPlanning', language)} />
        <NavItem to="/disease-checker" icon="🧪" label={getTranslation('diseaseChecker', language)} />
        <NavItem to="/education-hub" icon="🎓" label={getTranslation('educationHub', language)} />
        <NavItem to="/market-place" icon="🛒" label={getTranslation('marketplace', language)} />
        <NavItem to="/government-notices" icon="🏛️" label={getTranslation('governmentNotices', language)} />
        <NavItem to="/calendar" icon="🗓️" label={getTranslation('schedule', language)} />
        <NavItem to="/information-ledger" icon="📚" label={getTranslation('knowledgeBank', language)} />
        <NavItem to="/chatbot" icon="💬" label={getTranslation('chatbotPage', language)} />
        <NavItem to="/legal-aid" icon="⚖️" label={getTranslation('legalAid', language)} />
        <NavItem to="/profile" icon="👤" label={getTranslation('profile', language)} />
      </nav>
    </aside>
  );
};

export default Sidebar;


