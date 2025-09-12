import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const changeLanguage = (lang) => {
    setLanguage(lang);
    // Store in localStorage for persistence
    localStorage.setItem('krishi-seva-language', lang);
    try {
      document.documentElement.setAttribute('lang', lang);
    } catch {}
  };

  // Load saved language on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('krishi-seva-language');
    if (savedLanguage && ['en', 'hi', 'ml'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
      try { document.documentElement.setAttribute('lang', savedLanguage); } catch {}
    } else {
      try { document.documentElement.setAttribute('lang', 'en'); } catch {}
    }
  }, []);

  const value = {
    language,
    changeLanguage,
    isEnglish: language === 'en',
    isHindi: language === 'hi',
    isMalayalam: language === 'ml'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};


