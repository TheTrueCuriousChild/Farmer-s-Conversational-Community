import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, translations } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageSquare, 
  X,
  Minimize2,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { aiAPI } from '../services/api';

const Chatbot = () => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = translations[language];

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message when component mounts
    if (messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: language === 'en' 
          ? 'Hello! I\'m your AI farming assistant. How can I help you today?' 
          : 'ഹലോ! ഞാൻ നിങ്ങളുടെ AI കൃഷി അസിസ്റ്റന്റാണ്. ഇന്ന് എങ്ങനെ സഹായിക്കാം?',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [language]);

  const quickQuestions = [
    {
      en: 'What crops should I plant this season?',
      ml: 'ഈ സീസണിൽ എന്ത് വിളകൾ നടണം?'
    },
    {
      en: 'How to control pests naturally?',
      ml: 'കീടങ്ങളെ സ്വാഭാവികമായി എങ്ങനെ നിയന്ത്രിക്കാം?'
    },
    {
      en: 'What is the best fertilizer for rice?',
      ml: 'അരിക്ക് ഏറ്റവും നല്ല വളം എന്താണ്?'
    },
    {
      en: 'How to improve soil quality?',
      ml: 'മണ്ണിന്റെ ഗുണനിലവാരം എങ്ങനെ മെച്ചപ്പെടുത്താം?'
    },
    {
      en: 'Weather forecast for farming',
      ml: 'കൃഷിക്കുള്ള കാലാവസ്ഥ പ്രവചനം'
    },
    {
      en: 'Government schemes for farmers',
      ml: 'കർഷകരുടെ സർക്കാർ പദ്ധതികൾ'
    }
  ];

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiAPI.chat({
        message: messageText,
        userId: user?.id,
        role: user?.role || 'farmer'
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.message || (language === 'en' 
          ? 'I understand your question about farming. Let me help you with that.' 
          : 'കൃഷിയെക്കുറിച്ചുള്ള നിങ്ങളുടെ ചോദ്യം ഞാൻ മനസ്സിലാക്കി. അതിൽ സഹായിക്കട്ടെ.'),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback responses based on language
      const fallbackResponses = {
        en: [
          'I\'m here to help with your farming questions. Could you please rephrase your question?',
          'I understand you need assistance with farming. Let me provide some general guidance.',
          'I\'m learning about farming practices. Could you ask me something specific about crops or soil?'
        ],
        ml: [
          'കൃഷി ചോദ്യങ്ങളിൽ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്. നിങ്ങളുടെ ചോദ്യം വീണ്ടും ചോദിക്കാമോ?',
          'കൃഷിയിൽ സഹായം വേണമെന്ന് മനസ്സിലാക്കി. പൊതുവായ മാർഗദർശനം നൽകട്ടെ.',
          'കൃഷി പരിശീലനങ്ങളെക്കുറിച്ച് ഞാൻ പഠിക്കുന്നു. വിളകളെക്കുറിച്ചോ മണ്ണിനെക്കുറിച്ചോ എന്തെങ്കിലും പ്രത്യേകമായി ചോദിക്കാമോ?'
        ]
      };

      const randomResponse = fallbackResponses[language][Math.floor(Math.random() * fallbackResponses[language].length)];
      
      const botMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    handleSendMessage(question);
  };

  const clearChat = () => {
    setMessages([]);
    const welcomeMessage = {
      id: Date.now(),
      text: language === 'en' 
        ? 'Hello! I\'m your AI farming assistant. How can I help you today?' 
        : 'ഹലോ! ഞാൻ നിങ്ങളുടെ AI കൃഷി അസിസ്റ്റന്റാണ്. ഇന്ന് എങ്ങനെ സഹായിക്കാം?',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <MessageSquare className="w-8 h-8 mx-auto" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 max-w-full transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-[600px]'
    } ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl border ${
      isDarkMode ? 'border-gray-700' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t.aiFarmingAssistant}
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t.online}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title={language === 'en' ? 'Clear chat' : 'ചാറ്റ് മായ്ക്കുക'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-green-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-green-100' 
                        : isDarkMode 
                          ? 'text-gray-400' 
                          : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className={`px-4 py-2 rounded-2xl ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {t.aiThinking}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className={`p-4 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <p className={`text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t.quickQuestions}:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question[language])}
                    className={`text-left p-2 rounded-lg text-sm transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {question[language]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className={`p-4 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t.askMeFarming}
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;