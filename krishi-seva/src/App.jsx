import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DiseaseChecker from './pages/DiseaseChecker';
import FarmPlanning from './pages/FarmPlanning';
import CommunityChat from './pages/CommunityChat';
import RetailMarket from './pages/RetailMarket';
import ProduceGallery from './pages/ProduceGallery';
import EducationHub from './pages/EducationHub';
import QueryPage from './pages/QueryPage';
import GovernmentNotices from './pages/GovernmentNotices';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MarketPlace from './pages/MarketPlace';
import CalendarPage from './pages/Calendar';
import InformationLedger from './pages/InformationLedger';
import ChatbotPage from './pages/ChatbotPage';
import CallingAgent from './pages/CallingAgent';
import WhatsAppAgent from './pages/WhatsAppAgent';
import LegalAid from './pages/LegalAid';
import Profile from './pages/Profile';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/disease-checker" element={<DiseaseChecker />} />
              <Route path="/farm-planning" element={<FarmPlanning />} />
              <Route path="/community-chat" element={<CommunityChat />} />
              <Route path="/retail-market" element={<RetailMarket />} />
              <Route path="/market-place" element={<MarketPlace />} />
              <Route path="/produce-gallery" element={<ProduceGallery />} />
              <Route path="/education-hub" element={<EducationHub />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/information-ledger" element={<InformationLedger />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/calling-agent" element={<CallingAgent />} />
              <Route path="/whatsapp-agent" element={<WhatsAppAgent />} />
              <Route path="/legal-aid" element={<LegalAid />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/query-page" element={<QueryPage />} />
              <Route path="/government-notices" element={<GovernmentNotices />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
