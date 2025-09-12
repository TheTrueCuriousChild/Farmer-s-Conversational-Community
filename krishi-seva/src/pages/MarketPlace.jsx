import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';
import imgTomatoes from '../assets/Market place/image - organic tomatoes.jpg';
import imgOnions from '../assets/Market place/image-premium onions.jpg';
import imgPotatoes from '../assets/Market place/image - potatoes(A+ grade).jpg';
import imgRice from '../assets/Market place/image - basmati rice.jpg';
import mpOnions from '../assets/Market price/image - market prices - onions.jpg';
import mpPotatoes from '../assets/Market price/image -market prices - potatoes.jpg';
import mpTomatoesPrice from '../assets/Market price/image - market prices - tomatoes.jpg';
import mpWheat from '../assets/Market price/image - market prices - wheat.jpg';
import mpRice from '../assets/Market price/image-market prices - rice.jpg';
import mpSugarcane from '../assets/Market price/image - market prices - sugarcane.jpg';
import mpMillet from '../assets/Market price/image  - market prices - millet.jpg';
import mpGarlic from '../assets/Market price/image - market prices - garlic.jpg';
import mpGreenChilli from '../assets/Market price/image - market prices - green chilli.jpg';
import mpMaize from '../assets/Market price/image - market prices - maize (1).jpg';

const MarketPlace = () => {
  const { language } = useLanguage();

  const products = [
    {
      id: 1,
      title: 'Organic Tomatoes',
      price: '₹45/kg',
      description: 'Freshly harvested, pesticide-free tomatoes from local farms.',
      image: imgTomatoes,
      cta: 'Buy Now'
    },
    {
      id: 2,
      title: 'Premium Onions',
      price: '₹35/kg',
      description: 'Crisp and flavorful onions perfect for daily cooking.',
      image: imgOnions,
      cta: 'Buy Now'
    },
    {
      id: 3,
      title: 'Potatoes (A+ Grade)',
      price: '₹25/kg',
      description: 'Clean, uniform potatoes ideal for restaurants and homes.',
      image: imgPotatoes,
      cta: 'Buy Now'
    },
    {
      id: 4,
      title: 'Basmati Rice',
      price: '₹55/kg',
      description: 'Long-grain basmati rice with rich aroma and taste.',
      image: imgRice,
      cta: 'Buy Now'
    }
  ];

  const pageStyle = {
    padding: 'var(--spacing-xxl) 0'
  };

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
  };

  const imageStyle = {
    width: '100%',
    height: '220px',
    objectFit: 'cover'
  };

  const contentStyle = {
    padding: 'var(--spacing-lg)'
  };

  return (
    <div style={pageStyle}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          Market Place
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-xl)' }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <img src={product.image} alt={product.title} style={imageStyle} />
              <div style={contentStyle}>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{product.title}</h3>
                <p style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: 'var(--spacing-sm)' }}>{product.price}</p>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>{product.description}</p>
                <button className="btn-primary" style={{ width: '100%' }}>{getTranslation('buyNow', language)}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container" style={{ marginTop: 'var(--spacing-xxl)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Market Prices</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {[
            { name: 'Tomatoes', price: '₹45/kg', image: mpTomatoesPrice },
            { name: 'Onions', price: '₹35/kg', image: mpOnions },
            { name: 'Potatoes', price: '₹25/kg', image: mpPotatoes },
            { name: 'Rice', price: '₹55/kg', image: mpRice },
            { name: 'Wheat', price: '₹28/kg', image: mpWheat },
            { name: 'Sugarcane', price: '₹320/quintal', image: mpSugarcane },
            { name: 'Maize', price: '₹22/kg', image: mpMaize },
            { name: 'Millet', price: '₹40/kg', image: mpMillet },
            { name: 'Green Chilies', price: '₹60/kg', image: mpGreenChilli },
            { name: 'Garlic', price: '₹180/kg', image: mpGarlic }
          ].map((item, idx) => (
            <div key={idx} style={cardStyle}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
              </div>
              <h4 style={{ textAlign: 'center', marginBottom: 'var(--spacing-sm)' }}>{item.name}</h4>
              <p style={{ textAlign: 'center', color: 'var(--color-primary)', fontWeight: 700 }}>{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;



