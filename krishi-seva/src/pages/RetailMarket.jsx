import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const RetailMarket = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🏪' },
    { id: 'wholesale', name: 'Wholesale', icon: '📦' },
    { id: 'retail', name: 'Retail', icon: '🛒' },
    { id: 'equipment', name: 'Equipment', icon: '🔧' },
    { id: 'seeds', name: 'Seeds', icon: '🌱' },
    { id: 'fertilizers', name: 'Fertilizers', icon: '🌿' },
    { id: 'services', name: 'Services', icon: '⚙️' }
  ];

  const retailers = [
    {
      id: 1,
      name: 'Green Valley Agro',
      type: 'wholesale',
      location: 'Punjab, India',
      rating: 4.8,
      products: ['Rice', 'Wheat', 'Maize'],
      contact: '+91-98765-43210',
      description: 'Leading wholesale supplier of grains and cereals'
    },
    {
      id: 2,
      name: 'FarmTech Solutions',
      type: 'equipment',
      location: 'Maharashtra, India',
      rating: 4.6,
      products: ['Tractors', 'Irrigation Systems', 'Harvesters'],
      contact: '+91-98765-43211',
      description: 'Complete farm equipment and machinery solutions'
    },
    {
      id: 3,
      name: 'SeedMaster India',
      type: 'seeds',
      location: 'Karnataka, India',
      rating: 4.9,
      products: ['Hybrid Seeds', 'Organic Seeds', 'Vegetable Seeds'],
      contact: '+91-98765-43212',
      description: 'Premium quality seeds for all crops'
    },
    {
      id: 4,
      name: 'AgroFert Services',
      type: 'fertilizers',
      location: 'Gujarat, India',
      rating: 4.5,
      products: ['NPK Fertilizers', 'Organic Manure', 'Bio-fertilizers'],
      contact: '+91-98765-43213',
      description: 'Complete fertilizer solutions for modern farming'
    },
    {
      id: 5,
      name: 'CropCare Services',
      type: 'services',
      location: 'Tamil Nadu, India',
      rating: 4.7,
      products: ['Pest Control', 'Soil Testing', 'Crop Monitoring'],
      contact: '+91-98765-43214',
      description: 'Professional agricultural services and consulting'
    },
    {
      id: 6,
      name: 'FreshMart Retail',
      type: 'retail',
      location: 'Delhi, India',
      rating: 4.4,
      products: ['Fresh Vegetables', 'Fruits', 'Dairy Products'],
      contact: '+91-98765-43215',
      description: 'Fresh produce retail chain'
    }
  ];

  const filteredRetailers = retailers.filter(retailer => {
    const matchesCategory = selectedCategory === 'all' || retailer.type === selectedCategory;
    const matchesSearch = retailer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         retailer.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
          {getTranslation('retailMarket', language)}
        </h1>

        {/* Search and Filters */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search retailers, products, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                minWidth: '300px',
                padding: 'var(--spacing-md)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)'
              }}
            />
          </div>

          {/* Category Filters */}
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'btn-primary' : 'btn-outline'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  fontSize: '0.9rem'
                }}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
          Showing {filteredRetailers.length} retailers
        </p>

        {/* Retailers Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {filteredRetailers.map((retailer) => (
            <div
              key={retailer.id}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                <div>
                  <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>{retailer.name}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                    📍 {retailer.location}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <span>⭐</span>
                  <span style={{ fontWeight: '600' }}>{retailer.rating}</span>
                </div>
              </div>

              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)', lineHeight: '1.5' }}>
                {retailer.description}
              </p>

              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem' }}>Products/Services:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                  {retailer.products.map((product, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-white)',
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem'
                      }}
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    📞 {retailer.contact}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <button className="btn-outline" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.8rem' }}>
                    View Details
                  </button>
                  <button className="btn-primary" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.8rem' }}>
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRetailers.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xxl)', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🔍</div>
            <h3>No retailers found</h3>
            <p>Try adjusting your search criteria or browse different categories.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetailMarket;


