const Conversation = require('../models/Conversation');

// Log a conversation message
async function logConversation(userId, role, message) {
  try {
    await Conversation.create({ userId, role, message });
  } catch (err) {
    console.error('Failed to log conversation:', err.message);
  }
}

// Get conversation history for a user
async function getConversationHistory(userId, limit = 20) {
  return Conversation.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
}

module.exports = { logConversation, getConversationHistory };