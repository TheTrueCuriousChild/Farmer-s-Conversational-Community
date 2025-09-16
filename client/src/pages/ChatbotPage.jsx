import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const ChatbotPage = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
const [isRecording, setIsRecording] = useState(false);
const [mediaRecorder, setMediaRecorder] = useState(null);
const [audioChunks, setAudioChunks] = useState([]);

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
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setAudioChunks((prev) => [...prev, e.data]);
      }
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      sendVoiceToBackend(audioBlob);
      setAudioChunks([]);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  } catch (err) {
    console.error("Microphone error:", err);
    alert("Microphone access denied!");
  }
};

const stopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    setIsRecording(false);
  }
};

const sendVoiceToBackend = async (audioBlob) => {
  const formData = new FormData();
  formData.append("user_id", "farmer-123");
  formData.append("audio_file", audioBlob, "voice.webm");
  formData.append("language", language || "en");

  setMessages((prev) => [
    ...prev,
    { id: Date.now(), sender: 'user', text: "🎤 Sent voice message..." }
  ]);

  try {
    const res = await fetch("http://localhost:8000/chat/voice", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.transcript) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'user', text: `📝 ${data.transcript}` }
      ]);
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 2, sender: 'bot', text: data.text_response }
    ]);

    if (data.audio_response) {
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio_response), c => c.charCodeAt(0))],
        { type: "audio/mp3" }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      new Audio(audioUrl).play();
    }
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 3, sender: 'bot', text: "⚠️ Voice processing failed." }
    ]);
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
            <button
  type="button"
  onClick={isRecording ? stopRecording : startRecording}
  className="btn-secondary"
>
  {isRecording ? "⏹ Stop" : "🎤 Speak"}
</button>

            <button className="btn-primary" type="submit">{getTranslation('submit', language)}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;







