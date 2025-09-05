import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InvokeLLM } from "@/integrations/Core";

export default function ChatBot({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: user 
        ? `Hello ${user.full_name}! I'm KrishiBot, your AI farming assistant. How can I help you today?`
        : "Hello! I'm KrishiBot, your AI farming assistant. How can I help you with your farming queries today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const context = user ? `User info: ${user.full_name}, Location: ${user.location || 'Not specified'}, User type: ${user.user_type}` : "Anonymous user";
      
      const response = await InvokeLLM({
        prompt: `You are KrishiBot, an AI assistant for farmers. Help with farming queries, crop diseases, weather concerns, and agricultural advice. Keep responses concise and practical.
        
        Context: ${context}
        Query: ${inputMessage}`,
        add_context_from_internet: true
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: "bot",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team for assistance.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  return (
    <>
      {/* Chat toggle button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="w-14 h-14 rounded-full gradient-green text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </Button>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96">
          <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800">
            <CardHeader className="gradient-green text-white p-4 rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">KrishiBot</h3>
                  <p className="text-xs text-green-100">Your AI Farming Assistant</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {message.sender === 'user' ? (
                          <UserIcon className="w-3 h-3" />
                        ) : (
                          <Bot className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Bot className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 dark:border-gray-600 p-4">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about crops, diseases, weather..."
                    disabled={isTyping}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!inputMessage.trim() || isTyping}
                    className="gradient-green text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {user ? "Signed in - Get personalized advice" : "Sign up for personalized help"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}