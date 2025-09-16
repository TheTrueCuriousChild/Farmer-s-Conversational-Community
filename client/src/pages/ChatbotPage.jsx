import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const ChatbotPage = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

const sendMessage = async (e) => {
  e.preventDefault();
  if (!input.trim()) return;

  const userMsg = { id: Date.now(), sender: 'user', text: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput('');

  try {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "farmer-123",  // you can replace with actual user id
        message: input,
        language: language || "en"
      }),
    });

    const data = await res.json();
    const botMsg = { id: Date.now() + 1, sender: 'bot', text: data.response };

    setMessages((prev) => [...prev, botMsg]);

    // Optional: show suggestions
    if (data.suggestions?.length) {
      data.suggestions.forEach((s) => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), sender: 'bot', text: `💡 ${s}` }
        ]);
      });
    }
  } catch (err) {
    const errorMsg = { id: Date.now() + 1, sender: 'bot', text: "⚠️ Server not reachable." };
    setMessages((prev) => [...prev, errorMsg]);
  }
};

  return (
    <div style={{ padding: 'var(--spacing-xxl) 0' }}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>{getTranslation('chatbot.title', language)}</h1>
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          minHeight: 500,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>KrishiSeva Assistant</strong>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{getTranslation('chatbot.disclaimer', language)}</span>
          </div>
          <div style={{ flex: 1, padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', overflowY: 'auto' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <p>👋 {getTranslation('chatbot.welcome', language)}</p>
                <p>{getTranslation('chatbot.prompt', language)}</p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', background: m.sender === 'user' ? 'var(--color-primary)' : 'var(--color-surface)', color: m.sender === 'user' ? 'var(--color-white)' : 'var(--color-text)', border: '1px solid var(--color-border)', padding: '8px 12px', borderRadius: 8, maxWidth: '70%' }}>
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8, padding: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={getTranslation('chatbot.inputPlaceholder', language)} style={{ flex: 1 }} />
            <button className="btn-primary" type="submit">{getTranslation('submit', language)}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;







