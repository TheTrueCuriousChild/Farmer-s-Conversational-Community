import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const Header = ({ onToggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // TODO: Implement search functionality
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'var(--color-background)',
      borderBottom: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ paddingTop: 'var(--spacing-sm)', paddingBottom: 'var(--spacing-sm)' }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-md) 0',
          gap: 'var(--spacing-lg)'
        }}>
          {/* Logo and Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-white)',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              KS
            </div>
            <Link to="/" style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: 'var(--color-primary)',
              textDecoration: 'none'
            }}>
              KrishiSeva
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ 
            flex: '1', 
            maxWidth: '520px', 
            minWidth: '240px',
            display: 'flex',
            gap: 'var(--spacing-sm)'
          }}>
            <input
              type="text"
              placeholder={getTranslation('search', language)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid var(--color-border)',
                borderRadius: '999px',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)'
              }}
            />
            <button type="submit" className="btn-primary" style={{ borderRadius: '999px', padding: '0 16px', height: '44px' }}>
              🔍
            </button>
          </form>

          {/* Desktop Right Controls (sidebar replaces top nav) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-lg)'
          }} className="desktop-nav">
            {/* Language Dropdown */}
            <select
              value={language}
              onChange={handleLanguageChange}
              style={{
                padding: 'var(--spacing-sm)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)'
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ml">മലയാളം</option>
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost"
              style={{ padding: 'var(--spacing-sm)' }}
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Top links removed to declutter; use sidebar */}

            {/* Auth Buttons */}
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <Link to="/login" className="btn-outline" style={{ borderRadius: '999px' }}>
                {getTranslation('login', language)}
              </Link>
              <Link to="/signup" className="btn-primary" style={{ borderRadius: '999px' }}>
                {getTranslation('signup', language)}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onToggleSidebar}
              className="btn-ghost mobile-menu-btn"
              style={{ padding: 'var(--spacing-sm)' }}
              aria-label="Toggle sidebar"
              title="Menu"
            >
              ☰
            </button>
            <button
              onClick={toggleMenu}
              className="btn-ghost mobile-menu-btn"
              style={{ padding: 'var(--spacing-sm)' }}
              aria-label="Toggle menu"
              title="Quick Actions"
            >
              ⋮
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu" style={{
            padding: 'var(--spacing-md) 0',
            borderTop: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {/* Mobile Search */}
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <input
                  type="text"
                  placeholder={getTranslation('search', language)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text)'
                  }}
                />
                <button type="submit" className="btn-primary">
                  🔍
                </button>
              </form>

              {/* Mobile Navigation Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <Link to="/" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  {getTranslation('home', language)}
                </Link>
                <Link to="/disease-checker" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  {getTranslation('diseaseChecker', language)}
                </Link>
                <Link to="/farm-planning" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  {getTranslation('farmPlanning', language)}
                </Link>
                <Link to="/community-chat" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  {getTranslation('communityChat', language)}
                </Link>
                <Link to="/retail-market" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  {getTranslation('retailMarket', language)}
                </Link>
                <Link to="/market-place" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  Market Place
                </Link>
                <Link to="/produce-gallery" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  {getTranslation('produceGallery', language)}
                </Link>
                <Link to="/education-hub" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  {getTranslation('educationHub', language)}
                </Link>
                <Link to="/government-notices" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  {getTranslation('governmentNotices', language)}
                </Link>
                <Link to="/information-ledger" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  Knowledge Bank
                </Link>
                <Link to="/calendar" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  Calendar
                </Link>
                <Link to="/chatbot" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  Chatbot
                </Link>
                <Link to="/legal-aid" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  Legal Aid
                </Link>
              </div>

              {/* Mobile Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  style={{
                    padding: 'var(--spacing-sm)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text)'
                  }}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="ml">മലയാളം</option>
                </select>

                <button
                  onClick={toggleTheme}
                  className="btn-ghost"
                  style={{ padding: 'var(--spacing-sm)' }}
                  aria-label="Toggle theme"
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
              </div>

              {/* Mobile Auth Buttons */}
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <Link to="/login" className="btn-outline" style={{ flex: 1, textAlign: 'center' }}>
                  {getTranslation('login', language)}
                </Link>
                <Link to="/signup" className="btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                  {getTranslation('signup', language)}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
