import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Mock responses for unregistered users
  const mockResponses = {
    en: {
      'hello': 'Hello! Welcome to KrishiSeva. How can I help you today?',
      'disease': 'I can help you identify plant diseases. Please upload an image of the affected plant.',
      'weather': 'For weather information, please check our Farm Planning section.',
      'market': 'You can find market prices and connect with retailers in our Retail Market section.',
      'help': 'I can help you with basic questions. For detailed support, please register and use our Query Page.',
      'default': 'I understand you need help. For comprehensive support, please register on our platform and use the Query Page for detailed assistance.'
    },
    hi: {
      'hello': 'नमस्ते! कृषि सेवा में आपका स्वागत है। आज मैं आपकी कैसे मदद कर सकता हूं?',
      'disease': 'मैं आपको पौधों के रोगों की पहचान करने में मदद कर सकता हूं। कृपया प्रभावित पौधे की छवि अपलोड करें।',
      'weather': 'मौसम की जानकारी के लिए, कृपया हमारे फार्म प्लानिंग सेक्शन को देखें।',
      'market': 'आप हमारे रिटेल मार्केट सेक्शन में बाजार की कीमतें पा सकते हैं और खुदरा विक्रेताओं से जुड़ सकते हैं।',
      'help': 'मैं आपकी बुनियादी सवालों में मदद कर सकता हूं। विस्तृत सहायता के लिए, कृपया रजिस्टर करें और हमारे क्वेरी पेज का उपयोग करें।',
      'default': 'मैं समझता हूं कि आपको मदद चाहिए। व्यापक सहायता के लिए, कृपया हमारे प्लेटफॉर्म पर रजिस्टर करें और विस्तृत सहायता के लिए क्वेरी पेज का उपयोग करें।'
    },
    ml: {
      'hello': 'നമസ്കാരം! കൃഷി സേവയിലേക്ക് സ്വാഗതം. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?',
      'disease': 'സസ്യ രോഗങ്ങൾ തിരിച്ചറിയാൻ ഞാൻ നിങ്ങളെ സഹായിക്കാം. ദയവായി ബാധിത സസ്യത്തിന്റെ ചിത്രം അപ്ലോഡ് ചെയ്യുക.',
      'weather': 'കാലാവസ്ഥാ വിവരങ്ങൾക്കായി, ദയവായി ഞങ്ങളുടെ ഫാം പ്ലാനിംഗ് സെക്ഷൻ പരിശോധിക്കുക.',
      'market': 'നിങ്ങൾക്ക് ഞങ്ങളുടെ റീടെയിൽ മാർക്കറ്റ് സെക്ഷനിൽ മാർക്കറ്റ് വിലകൾ കണ്ടെത്താനും റീടെയിൽ വിൽപ്പനക്കാരുമായി ബന്ധപ്പെടാനും കഴിയും.',
      'help': 'ഞാൻ നിങ്ങളുടെ അടിസ്ഥാന ചോദ്യങ്ങളിൽ സഹായിക്കാം. വിശദമായ പിന്തുണയ്ക്കായി, ദയവായി രജിസ്റ്റർ ചെയ്യുകയും ഞങ്ങളുടെ ക്വറി പേജ് ഉപയോഗിക്കുകയും ചെയ്യുക.',
      'default': 'നിങ്ങൾക്ക് സഹായം വേണമെന്ന് ഞാൻ മനസ്സിലാക്കുന്നു. സമഗ്ര പിന്തുണയ്ക്കായി, ദയവായി ഞങ്ങളുടെ പ്ലാറ്റ്ഫോമിൽ രജിസ്റ്റർ ചെയ്യുകയും വിശദമായ സഹായത്തിനായി ക്വറി പേജ് ഉപയോഗിക്കുകയും ചെയ്യുക.'
    }
  };

  const getResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    const responses = mockResponses[language] || mockResponses.en;
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return responses.hello;
    } else if (lowerMessage.includes('disease') || lowerMessage.includes('रोग') || lowerMessage.includes('രോഗം')) {
      return responses.disease;
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('मौसम') || lowerMessage.includes('കാലാവസ്ഥ')) {
      return responses.weather;
    } else if (lowerMessage.includes('market') || lowerMessage.includes('बाजार') || lowerMessage.includes('മാർക്കറ്റ്')) {
      return responses.market;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('मदद') || lowerMessage.includes('സഹായം')) {
      return responses.help;
    } else {
      return responses.default;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleRegisterRedirect = () => {
    navigate('/signup');
    setIsOpen(false);
  };

  const chatButtonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-white)',
    border: 'none',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    zIndex: 1000,
    transition: 'all var(--transition-fast)'
  };

  const chatWindowStyle = {
    position: 'fixed',
    bottom: isFullscreen ? '0' : '90px',
    right: isFullscreen ? '0' : '20px',
    top: isFullscreen ? '0' : 'auto',
    left: isFullscreen ? '0' : 'auto',
    width: isFullscreen ? '100vw' : '350px',
    height: isFullscreen ? '100vh' : '500px',
    backgroundColor: 'var(--color-background)',
    border: '1px solid var(--color-border)',
    borderRadius: isFullscreen ? '0' : 'var(--radius-lg)',
    boxShadow: 'var(--shadow-xl)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1001,
    overflow: 'hidden'
  };

  const chatHeaderStyle = {
    padding: 'var(--spacing-md)',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-white)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const messagesStyle = {
    flex: 1,
    padding: 'var(--spacing-md)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm)'
  };

  const messageStyle = (sender) => ({
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderRadius: 'var(--radius-md)',
    maxWidth: '80%',
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
    backgroundColor: sender === 'user' ? 'var(--color-primary)' : 'var(--color-surface)',
    color: sender === 'user' ? 'var(--color-white)' : 'var(--color-text)',
    fontSize: '0.9rem',
    lineHeight: '1.4'
  });

  const inputStyle = {
    padding: 'var(--spacing-md)',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    gap: 'var(--spacing-sm)'
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={chatButtonStyle}
        aria-label="Open chat"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={chatWindowStyle}>
          <div style={chatHeaderStyle}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>KrishiSeva Assistant</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-white)',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? '🗗' : '🗖'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-white)',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          <div style={messagesStyle}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                padding: 'var(--spacing-lg)',
                fontSize: '0.9rem'
              }}>
                <p>👋 Hello! I'm your KrishiSeva assistant.</p>
                <p>Ask me about diseases, weather, markets, or any farming questions!</p>
                <button
                  onClick={handleRegisterRedirect}
                  className="btn-primary"
                  style={{ marginTop: 'var(--spacing-md)', fontSize: '0.8rem' }}
                >
                  Register for Full Support
                </button>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} style={messageStyle(message.sender)}>
                {message.text}
              </div>
            ))}

            {isTyping && (
              <div style={messageStyle('bot')}>
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                Typing...
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} style={inputStyle}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: 'var(--spacing-sm)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '0.9rem'
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: 'var(--spacing-sm)' }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;


