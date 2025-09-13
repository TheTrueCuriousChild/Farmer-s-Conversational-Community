import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { contactAPI, apiCall } from '../services/api';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Contact = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    method: 'call',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const contactMethods = [
    {
      id: 'call',
      title: 'Call Us',
      description: 'Speak directly with our support team',
      icon: Phone,
      color: 'bg-green-500',
      action: 'Call Now'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Chat with us on WhatsApp',
      icon: MessageSquare,
      color: 'bg-green-600',
      action: 'Start Chat'
    },
    {
      id: 'email',
      title: 'Email Us',
      description: 'Send us an email and we\'ll respond within 24 hours',
      icon: Mail,
      color: 'bg-blue-500',
      action: 'Send Email'
    },
    {
      id: 'message',
      title: 'Send Message',
      description: 'Leave us a message through our contact form',
      icon: MessageSquare,
      color: 'bg-purple-500',
      action: 'Send Message'
    }
  ];

  const adminContact = {
    phone: '+91 9876543210',
    email: 'admin@krishiseva.com',
    whatsapp: '+91 9876543210'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMethodSelect = (method) => {
    setFormData({
      ...formData,
      method
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contactData = {
        name: formData.name,
        phone: formData.phone,
        method: formData.method,
        message: formData.message
      };

      const result = await apiCall(contactAPI.submitContact, contactData);
      
      if (result.success) {
        toast.success('Your message has been sent successfully!');
        setFormData({
          name: user?.name || '',
          phone: user?.phone || '',
          email: user?.email || '',
          method: 'call',
          message: ''
        });
      } else {
        toast.error(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactAction = (method) => {
    switch (method) {
      case 'call':
        // In a real app, this would initiate a call
        toast.info(`Calling ${adminContact.phone}...`);
        break;
      case 'whatsapp':
        // In a real app, this would open WhatsApp
        toast.info(`Opening WhatsApp chat with ${adminContact.whatsapp}...`);
        break;
      case 'email':
        // In a real app, this would open email client
        window.location.href = `mailto:${adminContact.email}`;
        break;
      default:
        break;
    }
  };

  return (
    <div className={`min-h-screen py-8 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Contact Us
          </h1>
          <p className={`text-xl ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We're here to help! Choose your preferred way to get in touch with our support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Methods */}
          <div>
            <h2 className={`text-2xl font-semibold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Get in Touch
            </h2>
            
            <div className="space-y-4">
              {contactMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 ${
                    formData.method === method.id
                      ? isDarkMode
                        ? 'bg-gray-800 border-green-500 shadow-lg'
                        : 'bg-green-50 border-green-500 shadow-lg'
                      : isDarkMode
                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center`}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {method.title}
                      </h3>
                      <p className={`text-sm mb-3 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {method.description}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContactAction(method.id);
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          formData.method === method.id
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : isDarkMode
                              ? 'bg-gray-700 text-white hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {method.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className={`mt-8 p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Contact Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Phone
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {adminContact.phone}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Email
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {adminContact.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Address
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      KrishiSeva Headquarters<br />
                      Agricultural Technology Center<br />
                      New Delhi, India 110001
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Business Hours
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className={`text-2xl font-semibold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Success Message */}
            <div className={`mt-6 p-4 rounded-lg border ${
              isDarkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className={`text-sm ${
                  isDarkMode ? 'text-green-300' : 'text-green-700'
                }`}>
                  <strong>Quick Response:</strong> We typically respond within 2-4 hours during business hours.
                </p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className={`mt-4 p-4 rounded-lg border ${
              isDarkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className={`text-sm ${
                  isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
                }`}>
                  <strong>Emergency Support:</strong> For urgent agricultural issues, call our 24/7 helpline at {adminContact.phone}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
