import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, translations } from '../context/LanguageContext';
import { 
  MessageSquare, 
  Users, 
  BarChart3, 
  Shield, 
  ArrowRight,
  Leaf,
  Phone,
  Mail,
  Star,
  CheckCircle,
  Globe,
  Zap
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];

  const features = [
    {
      icon: MessageSquare,
      title: t.aiChatbot,
      description: t.aiChatbotDesc,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Users,
      title: t.community,
      description: t.communityDesc,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: BarChart3,
      title: t.analytics,
      description: t.analyticsDesc,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Shield,
      title: t.secure,
      description: t.secureDesc,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    }
  ];

  const userTypes = [
    {
      title: t.farmer,
      description: t.farmerDesc,
      icon: '🌾',
      color: 'from-green-400 to-green-600'
    },
    {
      title: t.retailer,
      description: t.retailerDesc,
      icon: '🏪',
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: t.laborer,
      description: t.laborerDesc,
      icon: '👷',
      color: 'from-orange-400 to-orange-600'
    },
    {
      title: t.admin,
      description: t.adminDesc,
      icon: '👨‍💼',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const stats = [
    { number: '10K+', label: language === 'en' ? 'Active Users' : 'സജീവ ഉപയോക്താക്കൾ' },
    { number: '50+', label: language === 'en' ? 'Crop Types' : 'വിളകൾ' },
    { number: '99%', label: language === 'en' ? 'Success Rate' : 'വിജയ നിരക്ക്' },
    { number: '24/7', label: language === 'en' ? 'Support' : 'പിന്തുണ' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`py-20 overflow-hidden ${
        isDarkMode ? 'bg-gray-900' : 'gradient-green-subtle'
      }`}>
        <div className="container">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full gradient-green flex items-center justify-center shadow-xl">
                  <span className="text-4xl">🌱</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-yellow-800" />
                </div>
              </div>
            </div>
            
            <h1 className={`text-6xl md:text-7xl font-bold mb-6 leading-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t.welcomeTitle.split('KrishiSeva')[0]}
              <span className="text-green-600">
                KrishiSeva
              </span>
            </h1>
            
            <p className={`text-2xl md:text-3xl mb-8 font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t.welcomeSubtitle}
            </p>
            
            <p className={`text-lg md:text-xl mb-12 max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {t.welcomeDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              {user ? (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-3 px-8 py-4 gradient-green text-white text-lg font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  {t.dashboard}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-3 px-8 py-4 gradient-green text-white text-lg font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    {t.getStarted}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className={`group inline-flex items-center gap-3 px-8 py-4 border-2 border-green-600 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      isDarkMode 
                        ? 'text-green-400 hover:bg-green-600 hover:text-white' 
                        : 'text-green-600 hover:bg-green-600 hover:text-white'
                    }`}
                  >
                    {t.login}
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.number}
                  </div>
                  <div className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t.whyChoose}
            </h2>
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t.featuresDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 hover:border-green-500' 
                    : 'bg-white border-gray-200 hover:border-green-300'
                }`}
              >
                <div className={`w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 text-green-600`} />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className={`py-20 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t.forEveryRole}
            </h2>
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t.rolesDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userTypes.map((type, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-green-500' 
                    : 'bg-white border-gray-200 hover:border-green-300'
                }`}
              >
                <div className={`w-20 h-20 gradient-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-4xl">{type.icon}</span>
                </div>
                <h3 className={`text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {type.title}
                </h3>
                <p className={`leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 gradient-green`}>
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 text-white`}>
              {t.readyToTransform}
            </h2>
            <p className={`text-xl md:text-2xl mb-12 text-green-100`}>
              {t.joinThousands}
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-green-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  {t.getStarted}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/chatbot"
                  className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white hover:text-green-600"
                >
                  {t.tryChatbot}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={`py-20 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t.needHelp}
            </h2>
            <p className={`text-xl md:text-2xl mb-12 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t.supportDescription}
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className={`flex items-center gap-6 p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className={`text-xl font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t.callUs}
                  </p>
                  <p className={`text-lg ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    +91 9876543210
                  </p>
                </div>
              </div>
              
              <div className={`flex items-center gap-6 p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className={`text-xl font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t.emailUs}
                  </p>
                  <p className={`text-lg ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    support@krishiseva.com
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                {t.contactSupport}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;