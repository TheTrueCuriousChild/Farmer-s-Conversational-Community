import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const Footer = () => {
  const { language } = useLanguage();

  const footerStyle = {
    backgroundColor: 'var(--color-surface)',
    borderTop: '1px solid var(--color-border)',
    padding: 'var(--spacing-xxl) 0 var(--spacing-lg)',
    marginTop: 'auto'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 var(--spacing-md)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--spacing-xl)',
    marginBottom: 'var(--spacing-xl)'
  };

  const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)'
  };

  const headingStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--color-primary)',
    marginBottom: 'var(--spacing-md)'
  };

  const linkStyle = {
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    transition: 'color var(--transition-fast)',
    padding: 'var(--spacing-xs) 0'
  };

  const bottomStyle = {
    borderTop: '1px solid var(--color-border)',
    paddingTop: 'var(--spacing-lg)',
    textAlign: 'center',
    color: 'var(--color-text-secondary)',
    fontSize: '0.9rem'
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={gridStyle}>
          {/* About Section */}
          <div style={sectionStyle}>
            <h3 style={headingStyle}>{getTranslation('aboutKrishiSeva', language)}</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              {getTranslation('aboutKrishiSevaLine1', language)}
              <br />
              {getTranslation('aboutKrishiSevaLine2', language)}
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
              <a href="#" style={linkStyle} aria-label="Facebook">📘</a>
              <a href="#" style={linkStyle} aria-label="Twitter">🐦</a>
              <a href="#" style={linkStyle} aria-label="Instagram">📷</a>
              <a href="#" style={linkStyle} aria-label="YouTube">📺</a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={sectionStyle}>
            <h3 style={headingStyle}>{getTranslation('quickLinks', language)}</h3>
            <Link to="/disease-checker" style={linkStyle}>
              {getTranslation('diseaseChecker', language)}
            </Link>
            <Link to="/farm-planning" style={linkStyle}>
              {getTranslation('farmPlanning', language)}
            </Link>
            <Link to="/community-chat" style={linkStyle}>
              {getTranslation('communityChat', language)}
            </Link>
            <Link to="/retail-market" style={linkStyle}>
              {getTranslation('retailMarket', language)}
            </Link>
            <Link to="/produce-gallery" style={linkStyle}>
              {getTranslation('produceGallery', language)}
            </Link>
            <Link to="/education-hub" style={linkStyle}>
              {getTranslation('educationHub', language)}
            </Link>
          </div>

          {/* Support */}
          <div style={sectionStyle}>
            <h3 style={headingStyle}>{getTranslation('support', language)}</h3>
            <Link to="/query-page" style={linkStyle}>
              {getTranslation('queryPage', language)}
            </Link>
            <Link to="/government-notices" style={linkStyle}>
              {getTranslation('governmentNotices', language)}
            </Link>
            <a href="mailto:support@krishiseva.com" style={linkStyle}>
              {getTranslation('contactSupport', language)}
            </a>
            <a href="tel:+91-1800-123-4567" style={linkStyle}>
              {getTranslation('helpline', language)}: +91-1800-123-4567
            </a>
          </div>

          {/* Legal */}
          <div style={sectionStyle}>
            <h3 style={headingStyle}>{getTranslation('legal', language)}</h3>
            <Link to="/about" style={linkStyle}>
              {getTranslation('aboutUs', language)}
            </Link>
            <Link to="/contact" style={linkStyle}>
              {getTranslation('contact', language)}
            </Link>
            <Link to="/privacy-policy" style={linkStyle}>
              {getTranslation('privacyPolicy', language)}
            </Link>
            <Link to="/terms" style={linkStyle}>
              {getTranslation('termsOfService', language)}
            </Link>
            <Link to="/admin-dashboard" style={linkStyle}>
              {getTranslation('adminDashboard', language)}
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={bottomStyle}>
          <p>
            © 2024 KrishiSeva. {getTranslation('rightsReserved', language)} | 
            {getTranslation('empoweringAgriTech', language)}
          </p>
          <p style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.8rem' }}>
            {getTranslation('madeWithLove', language)}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


