const Conversation = require('../models/Conversation');


// Log a conversation (user prompt and bot response, with language)
async function logConversation(username, prompt, response, language = 'en') {
  try {
    await Conversation.create({ username, prompt, response, language });
  } catch (err) {
    console.error('Failed to log conversation:', err.message);
  }
}

// Get conversation history for a user
async function getConversationHistory(username, limit = 20) {
  return Conversation.find({ username })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
}

module.exports = { logConversation, getConversationHistory };