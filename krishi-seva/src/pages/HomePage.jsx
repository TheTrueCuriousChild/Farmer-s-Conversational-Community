import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';
import heroVideo from '../assets/hero_video/Hero Section Video.mp4';
import mpTomatoes from '../assets/Market price/image - market prices - tomatoes.jpg';
import mpOnions from '../assets/Market price/image - market prices - onions.jpg';
import mpPotatoes from '../assets/Market price/image -market prices - potatoes.jpg';
import mpRice from '../assets/Market price/image-market prices - rice.jpg';
import mpWheat from '../assets/Market price/image - market prices - wheat.jpg';
import mpSugarcane from '../assets/Market price/image - market prices - sugarcane.jpg';

const HomePage = () => {
  const { language } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', newsletterEmail);
    setNewsletterEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  const heroStyle = {
    color: 'var(--color-white)',
    padding: 'var(--spacing-xxl) 0',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '60vh'
  };

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer'
  };

  const features = [
    {
      icon: '🔬',
      title: getTranslation('features.diseaseDetection', language),
      description: getTranslation('features.diseaseDetectionDesc', language),
      link: '/disease-checker'
    },
    {
      icon: '📊',
      title: getTranslation('features.farmPlanning', language),
      description: getTranslation('features.farmPlanningDesc', language),
      link: '/farm-planning'
    },
    {
      icon: '👥',
      title: getTranslation('features.communitySupport', language),
      description: getTranslation('features.communitySupportDesc', language),
      link: '/community-chat'
    },
    {
      icon: '🛒',
      title: getTranslation('features.marketAccess', language),
      description: getTranslation('features.marketAccessDesc', language),
      link: '/retail-market'
    }
  ];

  const mockProduce = [
    { name: 'Tomatoes', price: '₹45/kg', image: mpTomatoes },
    { name: 'Onions', price: '₹35/kg', image: mpOnions },
    { name: 'Potatoes', price: '₹25/kg', image: mpPotatoes },
    { name: 'Rice', price: '₹55/kg', image: mpRice },
    { name: 'Wheat', price: '₹28/kg', image: mpWheat },
    { name: 'Sugarcane', price: '₹320/quintal', image: mpSugarcane }
  ];

  const mockNotices = [
    {
      title: 'PM Kisan Scheme - New Installment',
      date: '2024-01-15',
      type: 'Financial Support'
    },
    {
      title: 'Weather Advisory - Heavy Rains Expected',
      date: '2024-01-14',
      type: 'Weather Alert'
    },
    {
      title: 'Subsidy on Solar Pumps',
      date: '2024-01-13',
      type: 'Equipment'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={heroStyle}>
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }}
        />
        <div className="container" />
      </section>

      {/* Headline Section (below hero) */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(46,125,50,1) 0%, rgba(102,187,106,1) 100%)',
        color: '#FFFFFF',
        padding: 'var(--spacing-xxl) 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-1.2px', textShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
            {getTranslation('heroTitle', language)}
          </h1>
          <p style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: 'var(--spacing-sm)', textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            {getTranslation('heroSubtitle', language)}
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--spacing-xl)' }}>
            <Link to="/signup" className="btn-primary" style={{ padding: 'var(--spacing-md) var(--spacing-xl)', fontSize: '1.1rem' }}>
              {getTranslation('getStarted', language)}
            </Link>
            <Link to="/education-hub" className="btn-outline" style={{ padding: 'var(--spacing-md) var(--spacing-xl)', fontSize: '1.1rem', backgroundColor: 'transparent', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
              {getTranslation('learnMore', language)}
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section style={{ padding: 'var(--spacing-xxl) 0', backgroundColor: 'var(--color-background)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>{getTranslation('keyFeatures', language)}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-xl)' }}>
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} style={{ textDecoration: 'none' }}>
                <div style={{
                  ...cardStyle,
                  padding: 'var(--spacing-xl)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ textAlign: 'center', marginBottom: 'var(--spacing-sm)' }}>
                    {feature.title}
                  </h3>
                  <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Market prices moved to Market Place page */}

      {/* Government Notices Preview */}
      <section style={{ padding: 'var(--spacing-xxl) 0', backgroundColor: 'var(--color-background)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h2>Government Notices</h2>
            <Link to="/government-notices" className="btn-outline">
              View All
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {mockNotices.map((notice, index) => (
              <div key={index} style={{
                ...cardStyle,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--spacing-md) var(--spacing-lg)'
              }}>
                <div>
                  <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{notice.title}</h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                    {notice.date} • {notice.type}
                  </p>
                </div>
                <span style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem'
                }}>
                  New
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section style={{ padding: 'var(--spacing-xxl) 0', backgroundColor: 'var(--color-primary)', color: 'var(--color-white)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Stay Updated</h2>
          <p style={{ marginBottom: 'var(--spacing-xl)', fontSize: '1.1rem', opacity: 0.9 }}>
            Subscribe to our newsletter for the latest agricultural news, tips, and updates.
          </p>
          <form onSubmit={handleNewsletterSubmit} style={{ 
            display: 'flex', 
            gap: 'var(--spacing-md)', 
            maxWidth: '400px', 
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              style={{
                flex: 1,
                minWidth: '250px',
                padding: 'var(--spacing-md)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              className="btn-secondary"
              style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


