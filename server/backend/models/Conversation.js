const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  username: { type: String, required: true },
  prompt: { type: String, required: true }, // User's message
  response: { type: String, required: true }, // Bot's reply
  language: { type: String, default: 'en' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', conversationSchema);