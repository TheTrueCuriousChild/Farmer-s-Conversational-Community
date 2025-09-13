import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, translations } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  MapPin, 
  User, 
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { contactAPI } from '../services/api';

const Contact = () => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await contactAPI.submitContact(formData);
      
      if (result.success) {
        toast.success(
          language === 'en' 
            ? 'Your message has been sent successfully!' 
            : 'നിങ്ങളുടെ സന്ദേശം വിജയകരമായി അയയ്ക്കപ്പെട്ടു!'
        );
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          subject: '',
          message: '',
          priority: 'medium'
        });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(
        language === 'en' 
          ? 'Failed to send message. Please try again.' 
          : 'സന്ദേശം അയയ്ക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.'
      );
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: t.callUs,
      description: language === 'en' 
        ? 'Speak directly with our support team' 
        : 'ഞങ്ങളുടെ പിന്തുണാ ടീമുമായി നേരിട്ട് സംസാരിക്കുക',
      action: '+91 9876543210',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      actionText: t.callNow
    },
    {
      icon: MessageSquare,
      title: language === 'en' ? 'WhatsApp' : 'വാട്സ്ആപ്പ്',
      description: language === 'en' 
        ? 'Chat with us on WhatsApp' 
        : 'വാട്സ്ആപ്പിൽ ഞങ്ങളുമായി ചാറ്റ് ചെയ്യുക',
      action: '+91 9876543210',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      actionText: language === 'en' ? 'Start Chat' : 'ചാറ്റ് ആരംഭിക്കുക'
    },
    {
      icon: Mail,
      title: t.emailUs,
      description: language === 'en' 
        ? 'Send us an email and we\'ll respond within 24 hours' 
        : 'ഞങ്ങൾക്ക് ഇമെയിൽ അയയ്ക്കുക, 24 മണിക്കൂറിനുള്ളിൽ മറുപടി നൽകും',
      action: 'support@krishiseva.com',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      actionText: language === 'en' ? 'Send Email' : 'ഇമെയിൽ അയയ്ക്കുക'
    }
  ];

  const businessHours = [
    {
      day: language === 'en' ? 'Monday - Friday' : 'തിങ്കൾ - വെള്ളി',
      time: '9:00 AM - 6:00 PM'
    },
    {
      day: language === 'en' ? 'Saturday' : 'ശനി',
      time: '10:00 AM - 4:00 PM'
    },
    {
      day: language === 'en' ? 'Sunday' : 'ഞായർ',
      time: language === 'en' ? 'Closed' : 'അടച്ചിരിക്കുന്നു'
    }
  ];

  return (
    <div className={`min-h-screen py-12 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {t.contactUs}
          </h1>
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t.choosePreferred}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${method.bgColor} rounded-xl flex items-center justify-center`}>
                    <method.icon className={`w-6 h-6 ${method.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {method.title}
                    </h3>
                    <p className={`text-sm mb-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {method.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {method.action}
                      </span>
                      <button className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                        method.color === 'text-green-600'
                          ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                          : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}>
                        {method.actionText}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Business Hours */}
            <div className={`p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t.businessHours}
              </h3>
              <div className="space-y-3">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {schedule.day}
                    </span>
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {schedule.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Support */}
            <div className={`p-6 rounded-2xl border-2 border-red-200 ${
              isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50'
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t.emergencySupport}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {t.emergencyDesc}
                  </p>
                  <a
                    href="tel:+919876543210"
                    className="text-red-600 font-medium text-sm hover:text-red-700"
                  >
                    +91 9876543210
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className={`p-8 rounded-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t.sendUsMessage}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {t.fullName} *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input pl-10"
                        placeholder={language === 'en' ? 'Enter your full name' : 'നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക'}
                        required
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {t.phoneNumber} *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input pl-10"
                        placeholder={language === 'en' ? 'Enter your phone number' : 'നിങ്ങളുടെ ഫോൺ നമ്പർ നൽകുക'}
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t.emailAddress}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input pl-10"
                      placeholder={language === 'en' ? 'Enter your email address' : 'നിങ്ങളുടെ ഇമെയിൽ വിലാസം നൽകുക'}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {language === 'en' ? 'Subject' : 'വിഷയം'} *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="">
                        {language === 'en' ? 'Select a subject' : 'ഒരു വിഷയം തിരഞ്ഞെടുക്കുക'}
                      </option>
                      <option value="general">
                        {language === 'en' ? 'General Inquiry' : 'പൊതു അന്വേഷണം'}
                      </option>
                      <option value="technical">
                        {language === 'en' ? 'Technical Support' : 'സാങ്കേതിക പിന്തുണ'}
                      </option>
                      <option value="billing">
                        {language === 'en' ? 'Billing Issue' : 'ബില്ലിംഗ് പ്രശ്നം'}
                      </option>
                      <option value="feature">
                        {language === 'en' ? 'Feature Request' : 'സവിശേഷത അഭ്യർത്ഥന'}
                      </option>
                      <option value="other">
                        {language === 'en' ? 'Other' : 'മറ്റുള്ളവ'}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {language === 'en' ? 'Priority' : 'പ്രാധാന്യം'}
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="low">
                        {language === 'en' ? 'Low' : 'കുറഞ്ഞ'}
                      </option>
                      <option value="medium">
                        {language === 'en' ? 'Medium' : 'ഇടത്തരം'}
                      </option>
                      <option value="high">
                        {language === 'en' ? 'High' : 'ഉയർന്ന'}
                      </option>
                      <option value="urgent">
                        {language === 'en' ? 'Urgent' : 'അടിയന്തിര'}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t.message} *
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="form-input pl-10"
                      placeholder={t.tellUsHow}
                      rows="6"
                      required
                    />
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        {language === 'en' ? 'Sending...' : 'അയയ്ക്കുന്നു...'}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Send Message' : 'സന്ദേശം അയയ്ക്കുക'}
                      </div>
                    )}
                  </button>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>
                      {t.quickResponseDesc}
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;