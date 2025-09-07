import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Mic, 
  Paperclip,
  MoreVertical,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "@/components/contexts/LanguageContext";

export default function Chatbot() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: t('krishiAiGreeting'),
      timestamp: new Date().toLocaleTimeString(),
      suggestions: [t('weatherUpdate'), t('cropAdvice'), t('marketPrices'), t('diseaseHelp')]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate API call to backend
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage) => {
    const responses = {
      weather: {
        content: "Based on current data, expect partly cloudy weather with 28°C temperature. Light rain expected in 2 days. Perfect time for irrigation!",
        suggestions: ['Irrigation schedule', 'Crop protection', 'Field preparation']
      },
      disease: {
        content: "I can help identify crop diseases. Please describe the symptoms or upload an image of affected leaves. Common signs include yellowing, spots, or wilting.",
        suggestions: ['Upload image', 'Describe symptoms', 'Treatment options']
      },
      fertilizer: {
        content: "For optimal growth, I recommend NPK 19:19:19 for vegetative stage. Apply 50kg per acre. Always test soil pH first - ideal range is 6.0-7.0.",
        suggestions: ['Soil testing', 'Application schedule', 'Organic alternatives']
      },
      market: {
        content: "Current market rates: Wheat ₹25/kg, Rice ₹30/kg, Tomato ₹40/kg. Prices are trending upward. Best time to sell is next week.",
        suggestions: ['Price alerts', 'Market trends', 'Selling tips']
      },
      default: {
        content: "I understand you're asking about farming. Could you be more specific? I can help with weather, diseases, fertilizers, market prices, and farming techniques.",
        suggestions: [t('weatherUpdate'), t('diseaseHelp'), t('marketPrices'), t('farmingTips')]
      }
    };

    const message = userMessage.toLowerCase();
    let response = responses.default;

    if (message.includes('weather') || message.includes('rain') || message.includes('temperature')) {
      response = responses.weather;
    } else if (message.includes('disease') || message.includes('pest') || message.includes('infection')) {
      response = responses.disease;
    } else if (message.includes('fertilizer') || message.includes('nutrient') || message.includes('soil')) {
      response = responses.fertilizer;
    } else if (message.includes('market') || message.includes('price') || message.includes('sell')) {
      response = responses.market;
    }

    return {
      id: Date.now(),
      type: 'bot',
      content: response.content,
      timestamp: new Date().toLocaleTimeString(),
      suggestions: response.suggestions
    };
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('chatbotTitle')}</h1>
              <p className="text-sm text-green-600 dark:text-green-400">{t('onlineReadyToHelp')}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.type === 'bot' && (
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : ''}`}>
              <Card className={`${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white border-0' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}>
                <CardContent className="p-3">
                  <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                    {message.content}
                  </p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp}
                  </p>
                </CardContent>
              </Card>
              
              {message.suggestions && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.suggestions.map((suggestion, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/50 text-xs"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 order-3">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {[t('weatherUpdate'), t('cropAdvice'), t('marketPrices'), t('diseaseHelp')].map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs"
              onClick={() => handleSendMessage(action)}
            >
              {action}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('askAnything')}
              className="pr-20 dark:bg-gray-800 dark:border-gray-600"
              disabled={isTyping}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button 
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
