import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const ProduceGallery = () => {
  const { language } = useLanguage();
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'grains', 'vegetables', 'fruits', 'spices', 'pulses'];

  const produceData = [
    { id: 1, name: 'Basmati Rice', category: 'grains', price: '₹85/kg', image: '🌾', quality: 'Premium', location: 'Punjab' },
    { id: 2, name: 'Tomatoes', category: 'vegetables', price: '₹45/kg', image: '🍅', quality: 'Fresh', location: 'Maharashtra' },
    { id: 3, name: 'Mangoes', category: 'fruits', price: '₹120/kg', image: '🥭', quality: 'Organic', location: 'Uttar Pradesh' },
    { id: 4, name: 'Turmeric', category: 'spices', price: '₹180/kg', image: '🟡', quality: 'Premium', location: 'Tamil Nadu' },
    { id: 5, name: 'Chickpeas', category: 'pulses', price: '₹95/kg', image: '🫘', quality: 'Organic', location: 'Rajasthan' },
    { id: 6, name: 'Wheat', category: 'grains', price: '₹28/kg', image: '🌾', quality: 'Standard', location: 'Haryana' },
    { id: 7, name: 'Onions', category: 'vegetables', price: '₹35/kg', image: '🧅', quality: 'Fresh', location: 'Karnataka' },
    { id: 8, name: 'Bananas', category: 'fruits', price: '₹60/kg', image: '🍌', quality: 'Fresh', location: 'Kerala' },
    { id: 9, name: 'Cardamom', category: 'spices', price: '₹2,500/kg', image: '🟢', quality: 'Premium', location: 'Kerala' },
    { id: 10, name: 'Lentils', category: 'pulses', price: '₹110/kg', image: '🫘', quality: 'Organic', location: 'Madhya Pradesh' }
  ];

  const filteredAndSortedProduce = produceData
    .filter(item => filterCategory === 'all' || item.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return parseFloat(a.price.replace(/[₹,]/g, '')) - parseFloat(b.price.replace(/[₹,]/g, ''));
        case 'quality':
          return a.quality.localeCompare(b.quality);
        default:
          return 0;
      }
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
    transition: 'all var(--transition-fast)',
    textAlign: 'center'
  };

  return (
    <div style={pageStyle}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('produceGallery', language)}
        </h1>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: '500' }}>Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
            >
              <option value="all">All Categories</option>
              <option value="grains">Grains</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="spices">Spices</option>
              <option value="pulses">Pulses</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: '500' }}>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="quality">Quality</option>
            </select>
          </div>
        </div>

        {/* Market Price Table */}
        <div style={{ marginBottom: 'var(--spacing-xxl)' }}>
          <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Market Price Table</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-white)' }}>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Produce</th>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Quality</th>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Price</th>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedProduce.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <span style={{ fontSize: '1.5rem' }}>{item.image}</span>
                      {item.name}
                    </td>
                    <td style={{ padding: 'var(--spacing-md)', textTransform: 'capitalize' }}>{item.category}</td>
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      <span style={{
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        backgroundColor: item.quality === 'Premium' ? 'var(--color-primary)' : 
                                         item.quality === 'Organic' ? 'var(--color-success)' : 'var(--color-info)',
                        color: 'var(--color-white)'
                      }}>
                        {item.quality}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--spacing-md)', fontWeight: '600', color: 'var(--color-primary)' }}>{item.price}</td>
                    <td style={{ padding: 'var(--spacing-md)' }}>{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gallery Grid */}
        <div>
          <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Produce Gallery</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {filteredAndSortedProduce.map((item) => (
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
                <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>
                  {item.image}
                </div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{item.name}</h3>
                <p style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '1.2rem', marginBottom: 'var(--spacing-sm)' }}>
                  {item.price}
                </p>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--spacing-md)' }}>
                  📍 {item.location}
                </p>
                <span style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  backgroundColor: item.quality === 'Premium' ? 'var(--color-primary)' : 
                                   item.quality === 'Organic' ? 'var(--color-success)' : 'var(--color-info)',
                  color: 'var(--color-white)',
                  marginBottom: 'var(--spacing-md)',
                  display: 'inline-block'
                }}>
                  {item.quality}
                </span>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center' }}>
                  <button className="btn-outline" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.8rem' }}>
                    View Details
                  </button>
                  <button className="btn-primary" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.8rem' }}>
                    Contact Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProduceGallery;


