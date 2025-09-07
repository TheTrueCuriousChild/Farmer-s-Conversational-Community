import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User as UserIcon } from 'lucide-react';

const translations = {
  en: {
    title: "Krishi Mitra AI Assistant",
    subtitle: "Ask me anything about farming, crops, or weather!",
    placeholder: "Type your message...",
    disclaimer: "This is an AI assistant. Information may not be 100% accurate."
  },
  hi: {
    title: "कृषि मित्र एआई सहायक",
    subtitle: "मुझसे खेती, फसलें, या मौसम के बारे में कुछ भी पूछें!",
    placeholder: "अपना संदेश टाइप करें...",
    disclaimer: "यह एक एआई सहायक है। जानकारी 100% सटीक नहीं हो सकती है।"
  },
  ml: {
    title: "കൃഷി മിത്ര AI അസിസ്റ്റന്റ്",
    subtitle: "കൃഷി, വിളകൾ, അല്ലെങ്കിൽ കാലാവസ്ഥയെക്കുറിച്ച് എന്നോട് എന്തും ചോദിക്കൂ!",
    placeholder: "നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക...",
    disclaimer: "ഇതൊരു AI അസിസ്റ്റന്റ് ആണ്. വിവരങ്ങൾ 100% കൃത്യമായിരിക്കണമെന്നില്ല."
  }
};

export default function Chatbot() {
  const [messages, setMessages] = useState([
  { from: 'bot', text: 'Hello! How can I help you with your farming needs today?' }]
  );
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en'); // Default language

  const t = translations[language];

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: `I've received your message: "${input}". As an AI assistant, I'm still learning. For detailed information, please check our Education page.` }]);
    }, 1000);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-4 space-y-4 overflow-auto">
          {messages.map((msg, index) =>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${msg.from === 'user' ? 'justify-end' : ''}`}>

              {msg.from === 'bot' && <Bot className="w-6 h-6 text-green-600" />}
              <div className="bg-slate-900 text-green-400 p-3 rounded-lg max-w-lg dark:bg-gray-800">
                {msg.text}
              </div>
              {msg.from === 'user' && <UserIcon className="w-6 h-6 text-blue-600" />}
            </motion.div>
          )}
        </CardContent>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()} />

            <Button onClick={handleSend}><Send className="w-4 h-4" /></Button>
          </div>
           <p className="text-xs text-gray-500 mt-2 text-center">{t.disclaimer}</p>
        </div>
      </Card>
    </div>);

}