import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, translations } from '../context/LanguageContext';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Package, 
  Users, 
  Settings,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Wrench,
  Building,
  Shield
} from 'lucide-react';
import RatingSystem from '../components/RatingSystem';

const Dashboard = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    revenue: 0
  });

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalUsers: 1250,
        activeUsers: 980,
        totalTransactions: 3450,
        revenue: 125000
      });
    }, 1000);
  }, []);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'farmer': return '🌾';
      case 'retailer': return '🏪';
      case 'laborer': return '👷';
      case 'admin': return '👨‍💼';
      default: return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'farmer': return 'from-green-400 to-green-600';
      case 'retailer': return 'from-blue-400 to-blue-600';
      case 'laborer': return 'from-orange-400 to-orange-600';
      case 'admin': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const renderFarmerDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`p-6 rounded-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full gradient-green flex items-center justify-center`}>
            <span className="text-3xl">🌾</span>
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t.welcomeBack}, {user?.name || 'Farmer'}!
            </h1>
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {language === 'en' ? 'Manage your farm and connect with buyers' : 'നിങ്ങളുടെ കൃഷിസ്ഥലം നിയന്ത്രിക്കുക, വാങ്ങുന്നവരുമായി ബന്ധപ്പെടുക'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Farm Size' : 'കൃഷിസ്ഥല വലുപ്പം'}
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.farmSize || 0} {language === 'en' ? 'acres' : 'ഏക്കർ'}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Crops Grown' : 'നടുന്ന വിളകൾ'}
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.crops?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Rating' : 'റേറ്റിംഗ്'}
              </p>
              <div className="flex items-center gap-2">
                <RatingSystem rating={4.5} totalRatings={23} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`p-6 rounded-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <h2 className={`text-xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {t.quickActions}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className={`p-4 rounded-xl border-2 border-green-200 hover:border-green-400 transition-colors ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-50 hover:bg-green-100'
          }`}>
            <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'Ask AI Assistant' : 'AI അസിസ്റ്റന്റിനോട് ചോദിക്കുക'}
            </p>
          </button>
          
          <button className={`p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-50 hover:bg-blue-100'
          }`}>
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'Find Buyers' : 'വാങ്ങുന്നവരെ കണ്ടെത്തുക'}
            </p>
          </button>
          
          <button className={`p-4 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-colors ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-orange-50 hover:bg-orange-100'
          }`}>
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'Crop Calendar' : 'വിള കലണ്ടർ'}
            </p>
          </button>
          
          <button className={`p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-colors ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-50 hover:bg-purple-100'
          }`}>
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'Market Prices' : 'മാർക്കറ്റ് വിലകൾ'}
            </p>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className={`p-6 rounded-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <h2 className={`text-xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {t.recentActivities}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {language === 'en' ? 'Rice harvest completed successfully' : 'അരി വിളവെടുപ്പ് വിജയകരമായി പൂർത്തിയാക്കി'}
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? '2 hours ago' : '2 മണിക്കൂർ മുമ്പ്'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <p className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {language === 'en' ? 'New buyer inquiry received' : 'പുതിയ വാങ്ങുന്നവരുടെ അന്വേഷണം ലഭിച്ചു'}
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? '1 day ago' : '1 ദിവസം മുമ്പ്'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRetailerDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`p-6 rounded-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full gradient-green flex items-center justify-center`}>
            <span className="text-3xl">🏪</span>
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t.welcomeBack}, {user?.businessName || 'Retailer'}!
            </h1>
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {language === 'en' ? 'Manage your business and source fresh produce' : 'നിങ്ങളുടെ ബിസിനസ് നിയന്ത്രിക്കുക, പുതിയ ഉൽപ്പന്നങ്ങൾ സ്രോതസ്സ് ചെയ്യുക'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Active Orders' : 'സജീവ ഓർഡറുകൾ'}
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                12
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Monthly Revenue' : 'മാസിക വരുമാനം'}
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ₹45,000
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Rating' : 'റേറ്റിംഗ്'}
              </p>
              <div className="flex items-center gap-2">
                <RatingSystem rating={4.2} totalRatings={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`p-6 rounded-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <h2 className={`text-xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {t.quickActions}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className={`p-4 rounded-xl border-2 border-green-200 hover:border-green-400 transition-colors ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-50 hover:bg-green-100'
          }`}>
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'Find Farmers' : 'കർഷകരെ കണ്ടെത്തുക'}
            </p>
          </button>
          
          <button className={`p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-50 hover:bg-blue-100'
          }`}>
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'Manage Inventory' : 'ഇൻവെന്ററി നിയന്ത്രിക്കുക'}
            </p>
          </button>
          
          <button className={`p-4 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-colors ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-orange-50 hover:bg-orange-100'
          }`}>
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'View Analytics' : 'വിശകലനം കാണുക'}
            </p>
          </button>
          
          <button className={`p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-colors ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-50 hover:bg-purple-100'
          }`}>
            <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'Customer Support' : 'ഉപഭോക്തൃ പിന്തുണ'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderLaborerDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`p-6 rounded-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full gradient-green flex items-center justify-center`}>
            <span className="text-3xl">👷</span>
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t.welcomeBack}, {user?.name || 'Laborer'}!
            </h1>
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {language === 'en' ? 'Find work opportunities and showcase your skills' : 'ജോലി അവസരങ്ങൾ കണ്ടെത്തുക, നിങ്ങളുടെ കഴിവുകൾ പ്രദർശിപ്പിക്കുക'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Skills' : 'കഴിവുകൾ'}
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.skills?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Experience' : 'അനുഭവം'}
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.experience || 0} {language === 'en' ? 'years' : 'വർഷം'}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Rating' : 'റേറ്റിംഗ്'}
              </p>
              <div className="flex items-center gap-2">
                <RatingSystem rating={4.7} totalRatings={31} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Jobs */}
      <div className={`p-6 rounded-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <h2 className={`text-xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {t.availableJobs}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {language === 'en' ? 'Rice Harvesting - 5 days' : 'അരി വിളവെടുപ്പ് - 5 ദിവസം'}
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Near Thrissur, Kerala' : 'തൃശൂരിന് സമീപം, കേരളം'}
              </p>
              <p className={`text-sm font-medium text-green-600`}>
                ₹800/day
              </p>
            </div>
            <button className="btn btn-primary text-sm px-4 py-2">
              {language === 'en' ? 'Apply' : 'അപേക്ഷിക്കുക'}
            </button>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {language === 'en' ? 'Vegetable Planting - 3 days' : 'പച്ചക്കറി നടൽ - 3 ദിവസം'}
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Near Palakkad, Kerala' : 'പാലക്കാടിന് സമീപം, കേരളം'}
              </p>
              <p className={`text-sm font-medium text-blue-600`}>
                ₹600/day
              </p>
            </div>
            <button className="btn btn-primary text-sm px-4 py-2">
              {language === 'en' ? 'Apply' : 'അപേക്ഷിക്കുക'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`p-6 rounded-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full gradient-green flex items-center justify-center`}>
            <span className="text-3xl">👨‍💼</span>
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t.welcomeBack}, {user?.username || 'Admin'}!
            </h1>
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {language === 'en' ? 'Manage the platform and support the community' : 'പ്ലാറ്റ്ഫോം നിയന്ത്രിക്കുക, കമ്മ്യൂണിറ്റിയെ പിന്തുണയ്ക്കുക'}
            </p>
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Total Users' : 'മൊത്തം ഉപയോക്താക്കൾ'}
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Active Users' : 'സജീവ ഉപയോക്താക്കൾ'}
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.activeUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Transactions' : 'ഇടപാടുകൾ'}
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.totalTransactions.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Platform Revenue' : 'പ്ലാറ്റ്ഫോം വരുമാനം'}
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ₹{stats.revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className={`p-6 rounded-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <h2 className={`text-xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {language === 'en' ? 'Admin Actions' : 'അഡ്മിൻ പ്രവർത്തനങ്ങൾ'}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className={`p-4 rounded-xl border-2 border-green-200 hover:border-green-400 transition-colors ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-50 hover:bg-green-100'
          }`}>
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'Manage Users' : 'ഉപയോക്താക്കളെ നിയന്ത്രിക്കുക'}
            </p>
          </button>
          
          <button className={`p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-50 hover:bg-blue-100'
          }`}>
            <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'View Reports' : 'റിപ്പോർട്ടുകൾ കാണുക'}
            </p>
          </button>
          
          <button className={`p-4 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-colors ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-orange-50 hover:bg-orange-100'
          }`}>
            <Settings className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'System Settings' : 'സിസ്റ്റം ക്രമീകരണങ്ങൾ'}
            </p>
          </button>
          
          <button className={`p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-colors ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-50 hover:bg-purple-100'
          }`}>
            <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'Support Center' : 'പിന്തുണാ കേന്ദ്രം'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'farmer':
        return renderFarmerDashboard();
      case 'retailer':
        return renderRetailerDashboard();
      case 'laborer':
        return renderLaborerDashboard();
      case 'admin':
        return renderAdminDashboard();
      default:
        return renderFarmerDashboard();
    }
  };

  return (
    <div className={`min-h-screen py-8 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;