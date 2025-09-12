import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const GovernmentNotices = () => {
  const { language } = useLanguage();
  const [filterScheme, setFilterScheme] = useState('all');

  const schemeTypes = [
    { id: 'all', name: 'All Schemes', icon: '📋' },
    { id: 'financial', name: 'Financial Support', icon: '💰' },
    { id: 'equipment', name: 'Equipment', icon: '🔧' },
    { id: 'weather', name: 'Weather Alerts', icon: '🌦️' },
    { id: 'training', name: 'Training', icon: '🎓' },
    { id: 'subsidy', name: 'Subsidies', icon: '📄' }
  ];

  const notices = [
    {
      id: 1,
      title: 'PM Kisan Scheme - 15th Installment Released',
      schemeType: 'financial',
      date: '2024-01-15',
      priority: 'high',
      description: 'The 15th installment of ₹2000 under PM Kisan scheme has been released. Farmers can check their status and apply if not enrolled.',
      details: 'Direct benefit transfer of ₹2000 to farmers\' bank accounts. Last date for enrollment: March 31, 2024.',
      link: '#',
      status: 'active'
    },
    {
      id: 2,
      title: 'Heavy Rainfall Alert - North India',
      schemeType: 'weather',
      date: '2024-01-14',
      priority: 'urgent',
      description: 'IMD has issued heavy rainfall warning for North India including Punjab, Haryana, and Delhi for next 3 days.',
      details: 'Farmers are advised to take necessary precautions, protect standing crops, and avoid field activities during heavy rains.',
      link: '#',
      status: 'active'
    },
    {
      id: 3,
      title: 'Subsidy on Solar Pumps - 2024',
      schemeType: 'equipment',
      date: '2024-01-13',
      priority: 'medium',
      description: 'Government announces 60% subsidy on solar water pumps for farmers. Application process now open.',
      details: 'Subsidy available for 3HP to 10HP solar pumps. Maximum subsidy amount: ₹1.5 lakhs per farmer.',
      link: '#',
      status: 'active'
    },
    {
      id: 4,
      title: 'Soil Health Card Scheme - Free Testing',
      schemeType: 'training',
      date: '2024-01-12',
      priority: 'medium',
      description: 'Free soil testing and health card distribution for all farmers. Book your slot now.',
      details: 'Soil samples will be collected and tested free of cost. Health cards will be delivered within 15 days.',
      link: '#',
      status: 'active'
    },
    {
      id: 5,
      title: 'Kisan Credit Card - Interest Rate Reduction',
      schemeType: 'financial',
      date: '2024-01-11',
      priority: 'high',
      description: 'Interest rate on Kisan Credit Card reduced to 4% per annum for loans up to ₹3 lakhs.',
      details: 'Effective from January 1, 2024. Existing cardholders can avail the reduced rate on renewal.',
      link: '#',
      status: 'active'
    },
    {
      id: 6,
      title: 'Agricultural Training Program - Organic Farming',
      schemeType: 'training',
      date: '2024-01-10',
      priority: 'low',
      description: 'Free training program on organic farming techniques. Registration open for farmers in Maharashtra.',
      details: '5-day residential training program covering organic farming, certification, and marketing strategies.',
      link: '#',
      status: 'active'
    }
  ];

  const filteredNotices = notices.filter(notice => 
    filterScheme === 'all' || notice.schemeType === filterScheme
  );

  const pageStyle = {
    padding: 'var(--spacing-xxl) 0',
    minHeight: '60vh'
  };

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: 'var(--spacing-lg)',
    transition: 'all var(--transition-fast)'
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'var(--color-error)';
      case 'high': return 'var(--color-warning)';
      case 'medium': return 'var(--color-info)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div style={pageStyle}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('governmentNotices', language)}
        </h1>

        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
          color: 'var(--color-white)',
          padding: 'var(--spacing-xxl)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          marginBottom: 'var(--spacing-xxl)'
        }}>
          <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>{getTranslation('stayInformed', language)}</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Get the latest updates on government schemes, weather alerts, subsidies, and agricultural policies that affect your farming business.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {schemeTypes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => setFilterScheme(scheme.id)}
              className={filterScheme === scheme.id ? 'btn-primary' : 'btn-outline'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-lg)'
              }}
            >
              <span>{scheme.icon}</span>
              {scheme.name}
            </button>
          ))}
        </div>

        {/* Notices List */}
        <div>
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{notice.title}</h3>
                    <span style={{
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      backgroundColor: getPriorityColor(notice.priority),
                      color: 'var(--color-white)',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}>
                      {notice.priority}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                      📅 {notice.date}
                    </span>
                    <span style={{
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-white)',
                      textTransform: 'capitalize'
                    }}>
                      {notice.schemeType}
                    </span>
                    <span style={{
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      backgroundColor: notice.status === 'active' ? 'var(--color-success)' : 'var(--color-warning)',
                      color: 'var(--color-white)',
                      textTransform: 'capitalize'
                    }}>
                      {notice.status}
                    </span>
                  </div>
                </div>
              </div>

              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: 'var(--spacing-md)' }}>
                {notice.description}
              </p>

              <div style={{
                backgroundColor: 'var(--color-background)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-md)',
                border: '1px solid var(--color-border)'
              }}>
                <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                  {getTranslation('additionalDetails', language)}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  {notice.details}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a
                  href={notice.link}
                  className="btn-primary"
                  style={{ padding: 'var(--spacing-sm) var(--spacing-lg)', textDecoration: 'none' }}
                >
                  {getTranslation('viewDetails', language)}
                </a>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <button className="btn-ghost" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.8rem' }}>
                    📌 {getTranslation('saveAction', language)}
                  </button>
                  <button className="btn-ghost" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.8rem' }}>
                    📤 {getTranslation('shareAction', language)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotices.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xxl)', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📋</div>
            <h3>{getTranslation('noNoticesFound', language)}</h3>
            <p>{getTranslation('tryDifferentScheme', language)}</p>
          </div>
        )}

        {/* Quick Links */}
        <div style={{ marginTop: 'var(--spacing-xxl)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>{getTranslation('quickLinks', language)}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
            <div style={cardStyle}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🌐</div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{getTranslation('governmentPortals', language)}</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                  Access official government websites for detailed information
                </p>
                <button className="btn-outline">{getTranslation('visitPortals', language)}</button>
              </div>
            </div>
            <div style={cardStyle}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📞</div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{getTranslation('helplineNumbers', language)}</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                  Get direct assistance from government helplines
                </p>
                <button className="btn-outline">{getTranslation('viewNumbers', language)}</button>
              </div>
            </div>
            <div style={cardStyle}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📱</div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{getTranslation('mobileApps', language)}</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                  Download official government mobile applications
                </p>
                <button className="btn-outline">{getTranslation('downloadApps', language)}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentNotices;


