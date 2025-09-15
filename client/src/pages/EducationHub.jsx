import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const EducationHub = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: getTranslation('allContent', language), icon: '📚' },
    { id: 'articles', name: getTranslation('articles', language), icon: '📄' },
    { id: 'videos', name: getTranslation('videos', language), icon: '🎥' },
    { id: 'courses', name: getTranslation('courses', language), icon: '🎓' }
  ];

  const content = [
    {
      id: 1,
      title: 'Modern Farming Techniques for Rice Cultivation',
      type: 'article',
      category: 'articles',
      author: 'Dr. Rajesh Kumar',
      duration: '8 min read',
      description: 'Learn about the latest techniques in rice cultivation including SRI method, water management, and pest control.',
      image: '🌾',
      rating: 4.8,
      views: 1250
    },
    {
      id: 2,
      title: 'Organic Farming: Complete Guide',
      type: 'video',
      category: 'videos',
      author: 'Green Farm Academy',
      duration: '45 min',
      description: 'Comprehensive video guide covering organic farming principles, certification, and implementation strategies.',
      image: '🌱',
      rating: 4.9,
      views: 3200
    },
    {
      id: 3,
      title: 'Agricultural Business Management Course',
      type: 'course',
      category: 'courses',
      author: 'AgriBusiness Institute',
      duration: '6 weeks',
      description: 'Master the fundamentals of agricultural business including marketing, finance, and supply chain management.',
      image: '💼',
      rating: 4.7,
      views: 890
    },
    {
      id: 4,
      title: 'Soil Health and Nutrient Management',
      type: 'article',
      category: 'articles',
      author: 'Dr. Priya Sharma',
      duration: '12 min read',
      description: 'Understanding soil composition, testing methods, and effective nutrient management for better crop yields.',
      image: '🌍',
      rating: 4.6,
      views: 2100
    },
    {
      id: 5,
      title: 'Drip Irrigation System Setup',
      type: 'video',
      category: 'videos',
      author: 'Irrigation Solutions',
      duration: '32 min',
      description: 'Step-by-step guide to setting up and maintaining drip irrigation systems for efficient water usage.',
      image: '💧',
      rating: 4.8,
      views: 1800
    },
    {
      id: 6,
      title: 'Digital Agriculture and IoT in Farming',
      type: 'course',
      category: 'courses',
      author: 'TechFarm Academy',
      duration: '4 weeks',
      description: 'Explore how Internet of Things and digital technologies are revolutionizing modern agriculture.',
      image: '📱',
      rating: 4.5,
      views: 650
    }
  ];

  const filteredContent = content.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
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
    transition: 'all var(--transition-fast)'
  };

  return (
    <div style={pageStyle}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('educationHub', language)}
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
          <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>{getTranslation('learnGrowSucceed', language)}</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Access expert knowledge, practical guides, and comprehensive courses to enhance your agricultural skills and business success.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? 'btn-primary' : 'btn-outline'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-lg)'
              }}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {filteredContent.map((item) => (
            <div
              key={item.id}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ fontSize: '3rem' }}>{item.image}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.title}</h3>
                    <span style={{
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      backgroundColor: item.type === 'article' ? 'var(--color-info)' :
                                     item.type === 'video' ? 'var(--color-error)' : 'var(--color-success)',
                      color: 'var(--color-white)',
                      textTransform: 'capitalize'
                    }}>
                      {item.type}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                    by {item.author}
                  </p>
                </div>
              </div>

              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.5', marginBottom: 'var(--spacing-md)' }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                    ⏱️ {item.duration}
                  </span>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                    👁️ {item.views} views
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <span>⭐</span>
                  <span style={{ fontWeight: '600' }}>{item.rating}</span>
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', padding: 'var(--spacing-sm)' }}>
                {item.type === 'article' ? 'Read Article' :
                 item.type === 'video' ? 'Watch Video' : 'Enroll in Course'}
              </button>
            </div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xxl)', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📚</div>
            <h3>{getTranslation('noContentFound', language)}</h3>
            <p>{getTranslation('tryDifferentCategory', language)}</p>
          </div>
        )}

        {/* Featured Section */}
        <div style={{ marginTop: 'var(--spacing-xxl)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>{getTranslation('featuredThisWeek', language)}</h2>
          <div style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>🌟</div>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Advanced Crop Rotation Strategies</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)', maxWidth: '500px', margin: '0 auto var(--spacing-lg)' }}>
              Learn how to implement effective crop rotation techniques to improve soil health, reduce pests, and increase yields.
            </p>
            <button className="btn-primary" style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}>
              {getTranslation('accessFeatured', language)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationHub;


