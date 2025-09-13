import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  MessageSquare, 
  Users, 
  BarChart3, 
  Shield, 
  ArrowRight,
  Leaf,
  Phone,
  Mail
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chatbot',
      description: 'Get instant answers to your farming questions with our intelligent AI assistant.',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with fellow farmers, share experiences, and learn from each other.',
      color: 'text-green-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track your farm performance with detailed analytics and insights.',
      color: 'text-purple-600'
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Your data is protected with enterprise-grade security measures.',
      color: 'text-red-600'
    }
  ];

  const userTypes = [
    {
      title: 'Farmer',
      description: 'Manage your farm, get crop advice, and connect with buyers.',
      icon: '🌾'
    },
    {
      title: 'Retailer',
      description: 'Source fresh produce directly from farmers and manage your inventory.',
      icon: '🏪'
    },
    {
      title: 'Laborer',
      description: 'Find work opportunities and showcase your farming skills.',
      icon: '👷'
    },
    {
      title: 'Admin',
      description: 'Manage the platform and support the farming community.',
      icon: '👨‍💼'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`py-20 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-green-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome to{' '}
              <span className="text-green-600">KrishiSeva</span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Your comprehensive agricultural platform for modern farming
            </p>
            <p className={`text-lg mb-12 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-700'
            }`}>
              Whether you're a farmer, retailer, laborer, or admin, we have the tools and community you need to succeed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className={`inline-flex items-center gap-2 px-8 py-4 border-2 border-green-600 text-lg font-semibold rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'text-green-400 hover:bg-green-600 hover:text-white' 
                        : 'text-green-600 hover:bg-green-600 hover:text-white'
                    }`}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Why Choose KrishiSeva?
            </h2>
            <p className={`text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Comprehensive tools and features designed for the agricultural community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border transition-all duration-300 hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 hover:border-green-500' 
                    : 'bg-white border-gray-200 hover:border-green-300'
                }`}
              >
                <feature.icon className={`w-12 h-12 mb-4 ${feature.color}`} />
                <h3 className={`text-xl font-semibold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`${
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
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              For Every Role in Agriculture
            </h2>
            <p className={`text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Tailored experiences for different members of the farming community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userTypes.map((type, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border transition-all duration-300 hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-green-500' 
                    : 'bg-white border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className={`text-xl font-semibold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {type.title}
                </h3>
                <p className={`${
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
      <section className={`py-20 ${
        isDarkMode ? 'bg-gray-800' : 'bg-green-600'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className={`text-4xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-white'
            }`}>
              Ready to Transform Your Agricultural Journey?
            </h2>
            <p className={`text-xl mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-green-100'
            }`}>
              Join thousands of farmers, retailers, and agricultural professionals who trust KrishiSeva.
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/chatbot"
                  className={`inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-lg font-semibold rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'text-white hover:bg-white hover:text-gray-900' 
                      : 'text-white hover:bg-white hover:text-green-600'
                  }`}
                >
                  Try Our Chatbot
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
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className={`text-4xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Need Help? We're Here for You
            </h2>
            <p className={`text-xl mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Our support team is ready to assist you with any questions or concerns.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div className={`flex items-center gap-3 p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <Phone className="w-6 h-6 text-green-600" />
                <div>
                  <p className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Call Us
                  </p>
                  <p className={`${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    +91 9876543210
                  </p>
                </div>
              </div>
              
              <div className={`flex items-center gap-3 p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <Mail className="w-6 h-6 text-green-600" />
                <div>
                  <p className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Email Us
                  </p>
                  <p className={`${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    support@krishiseva.com
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Contact Support
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
