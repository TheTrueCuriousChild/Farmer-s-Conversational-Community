import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Chatbot from './Chatbot';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const layoutStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  const mainStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div style={layoutStyle}>
      <Header onToggleSidebar={() => setIsSidebarOpen((v) => !v)} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} />
      <main style={{ ...mainStyle, paddingLeft: isSidebarOpen ? '260px' : '0', transition: 'padding-left var(--transition-normal)' }}>
        {children}
      </main>
      <Footer />
      <Chatbot />
      {/* Floating Action Icons */}
      <div style={{ position: 'fixed', right: '20px', bottom: '100px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1002 }}>
        <a href="tel:+919876543210" aria-label="Call agent" title="Call Agent" style={{
          width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-primary)', color: 'var(--color-white)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)'
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V21a1 1 0 01-1 1C11.85 22 2 12.15 2 1a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" fill="currentColor"/>
          </svg>
        </a>
        <Link to="/whatsapp-agent" aria-label="WhatsApp agent" title="WhatsApp Agent" style={{
          width: '50px', height: '50px', borderRadius: '50%', background: '#25D366', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)'
        }}>
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="#FFFFFF" d="M27.2 4.8A15.7 15.7 0 0016 0C7.2 0 0 7.2 0 16c0 2.8.7 5.4 2 7.8L0 32l8.5-2.2A15.8 15.8 0 0016 32c8.8 0 16-7.2 16-16 0-4.3-1.7-8.3-4.8-11.2zM16 29.3c-2.4 0-4.7-.6-6.8-1.9l-.5-.3-5 1.3 1.3-4.9-.3-.5A13.3 13.3 0 012.7 16C2.7 8.7 8.7 2.7 16 2.7S29.3 8.7 29.3 16 23.3 29.3 16 29.3zm8.4-10.3c-.5-.3-2.8-1.4-3.3-1.6-.4-.1-.8-.2-1.1.3-.3.5-1.2 1.6-1.5 1.9-.3.3-.6.3-1.1.1-.5-.3-2.1-.8-4-2.5-1.5-1.3-2.5-2.8-2.8-3.3-.3-.5 0-.8.2-1.1.2-.2.5-.6.7-.9.2-.3.3-.5.4-.8.1-.3 0-.6 0-.8 0-.3-.9-2.6-1.2-3.5-.3-.9-.7-.8-1.1-.8h-1c-.4 0-.8.2-1.1.6-.4.5-1.4 1.4-1.4 3.3 0 1.9 1.4 3.7 1.6 3.9.2.3 2.8 4.3 6.8 6 4 .1 6.1 3.4 6.3 3.6.2.2 3.1 2 3.9 2 .8 0 1.7-.8 1.9-1.5.2-.7.2-1.3.1-1.5-.1-.1-.4-.2-.9-.4z"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Layout;


