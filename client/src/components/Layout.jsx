import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, translations } from '../context/LanguageContext';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Home, 
  MessageSquare, 
  User, 
  LogOut,
  Phone,
  Mail,
  HelpCircle,
  Globe
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const t = translations[language];

  const navigationItems = [
    { name: t.home, path: '/', icon: Home },
    { name: t.chatbot, path: '/chatbot', icon: MessageSquare },
    { name: t.contact, path: '/contact', icon: HelpCircle },
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-green-100'
      }`}>
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
              <h1 className="text-2xl font-bold text-green-600">
                KrishiSeva
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300'
                      : isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className={`appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDarkMode 
                      ? 'text-white bg-gray-700' 
                      : 'text-gray-700 bg-white'
                  }`}
                >
                  <option value="en">English</option>
                  <option value="ml">മലയാളം</option>
                </select>
                <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    {t.dashboard}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    {t.logout}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {t.login}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    {t.register}
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300'
                      : isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="pt-4 space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    {t.dashboard}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    {t.logout}
                  </button>
                </div>
              ) : (
                <div className="pt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {t.login}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    {t.register}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className={`mt-20 border-t transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center">
                  <span className="text-white font-bold">🌱</span>
                </div>
                <h3 className="font-bold text-lg">KrishiSeva</h3>
              </div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Empowering farmers with technology for sustainable agriculture and better livelihoods.
              </p>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t.features}
              </h4>
              <div className="space-y-2">
                <Link to="/chatbot" className={`block text-sm hover:text-green-600 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.aiChatbot}
                </Link>
                <Link to="/contact" className={`block text-sm hover:text-green-600 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.support}
                </Link>
              </div>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t.support}
              </h4>
              <div className="space-y-2">
                <Link to="/contact" className={`block text-sm hover:text-green-600 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.helpCenter}
                </Link>
                <div className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    +91 9876543210
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    support@krishiseva.com
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t.contact}
              </h4>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t.supportDescription}
              </p>
            </div>
          </div>

          <div className={`mt-8 pt-8 border-t text-center text-sm ${
            isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
          }`}>
            <p>&copy; 2024 KrishiSeva. {t.allRightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;