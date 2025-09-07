// server/routes/ai_routes.js
const express = require('express');
const axios = require('axios');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const JWT_SECRET = process.env.JWT_SECRET;

// Rate limiting
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: { error: 'Too many chat requests, please try again later' }
});

const imageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // limit image uploads
  message: { error: 'Too many image uploads, please try again later' }
});

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Validation middlewares
const validateChatInput = [
  body('message')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
    .trim()
    .escape(),
  body('language')
    .optional()
    .isIn(['en', 'ml'])
    .withMessage('Language must be either en or ml'),
];

// Helper function to make requests to AI service
async function callAIService(endpoint, data, headers = {}) {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}${endpoint}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        timeout: 30000 // 30 second timeout
      }
    );
    return response.data;
  } catch (error) {
    console.error(`AI Service Error (${endpoint}):`, error.message);
    if (error.response) {
      throw new Error(`AI Service Error: ${error.response.data.detail || error.response.statusText}`);
    }
    throw new Error('AI service temporarily unavailable');
  }
}

// Chat endpoint
router.post('/chat', chatLimiter, authenticateToken, validateChatInput, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: errors.array()
      });
    }

    const { message, language, context } = req.body;
    const userId = req.user.id;

    // Prepare request for AI service
    const aiRequest = {
      message: message,
      user_id: userId,
      language: language || 'en',
      context: context || {}
    };

    // Call AI service
    const aiResponse = await callAIService('/chat', aiRequest, {
      'Authorization': `Bearer ${req.headers.authorization.split(' ')[1]}`
    });

    // Log the interaction (optional)
    console.log(`Chat interaction - User: ${userId}, Intent: ${aiResponse.metadata?.intent}`);

    res.json({
      success: true,
      response: aiResponse.response,
      metadata: aiResponse.metadata,
      suggestions: aiResponse.suggestions || []
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process your question. Please try again.',
      message: error.message
    });
  }
});

// Image analysis endpoint
router.post('/analyze-image', imageLimiter, authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { description = '', language = 'en' } = req.body;
    const userId = req.user.id;

    // Prepare form data for AI service
    const FormData = require('form-data');
    const formData = new FormData();
    
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('user_id', userId);
    formData.append('description', description);
    formData.append('language', language);

    // Call AI service with form data
    const response = await axios.post(
      `${AI_SERVICE_URL}/analyze-image`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${req.headers.authorization.split(' ')[1]}`
        },
        timeout: 60000 // 60 second timeout for image processing
      }
    );

    res.json({
      success: true,
      ...response.data
    });

  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze image. Please try again.',
      message: error.response?.data?.detail || error.message
    });
  }
});

// Get conversation history
router.get('/conversation/:userId?', authenticateToken, async (req, res) => {
  try {
    const requestedUserId = req.params.userId || req.user.id;
    
    // Users can only access their own history unless they're admin
    if (requestedUserId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const response = await callAIService(`/conversation/${requestedUserId}`, {}, {
      'Authorization': `Bearer ${req.headers.authorization.split(' ')[1]}`
    });

    res.json({
      success: true,
      ...response
    });

  } catch (error) {
    console.error('Conversation history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve conversation history',
      message: error.message
    });
  }
});

// Translation endpoint
router.post('/translate', authenticateToken, [
  body('text').isLength({ min: 1, max: 2000 }).withMessage('Text must be between 1 and 2000 characters'),
  body('from_lang').isIn(['en', 'ml', 'hi']).withMessage('Invalid source language'),
  body('to_lang').isIn(['en', 'ml', 'hi']).withMessage('Invalid target language'),
  body('context').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: errors.array()
      });
    }

    const { text, from_lang, to_lang, context = 'agricultural' } = req.body;

    // Prepare form data
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('text', text);
    formData.append('from_lang', from_lang);
    formData.append('to_lang', to_lang);
    formData.append('context', context);

    const response = await axios.post(
      `${AI_SERVICE_URL}/translate`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${req.headers.authorization.split(' ')[1]}`
        },
        timeout: 15000
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      success: false,
      error: 'Translation failed',
      message: error.message
    });
  }
});

// Health check for AI services
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 5000 });
    res.json({
      status: 'healthy',
      ai_service: response.data
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'AI service unavailable',
      message: error.message
    });
  }
});

module.exports = router;

// server/routes/chatbot_routes.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { body, validationResult, param } = require('express-validator');

const router = express.Router();

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    type: { type: String, enum: ['user', 'bot'], required: true },
    content: { type: String, required: true },
    language: { type: String, enum: ['en', 'ml'], default: 'en' },
    intent: { type: String },
    confidence: { type: Number },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed }
  }],
  context: {
    crop: String,
    location: String,
    farmingType: String,
    experienceLevel: String,
    currentSeason: String
  },
  isActive: { type: Boolean, default: true },
  lastActivity: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Conversation = mongoose.model('Conversation', conversationSchema);

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  messageId: { type: mongoose.Schema.Types.ObjectId },
  rating: { type: Number, min: 1, max: 5 },
  feedback: String,
  category: { 
    type: String, 
    enum: ['accuracy', 'helpfulness', 'language', 'response_time', 'other'] 
  },
  timestamp: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get or create conversation for user
router.get('/conversation', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    let conversation = await Conversation.findOne({ 
      userId: userId, 
      isActive: true 
    }).sort({ lastActivity: -1 });

    if (!conversation) {
      conversation = new Conversation({
        userId: userId,
        messages: [],
        context: {}
      });
      await conversation.save();
    }

    res.json({
      success: true,
      conversation: {
        id: conversation._id,
        messages: conversation.messages.slice(-10), // Last 10 messages
        context: conversation.context,
        lastActivity: conversation.lastActivity
      }
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve conversation'
    });
  }
});

// Save message to conversation
router.post('/conversation/message', authenticateToken, [
  body('content').isLength({ min: 1, max: 1000 }).withMessage('Content required'),
  body('type').isIn(['user', 'bot']).withMessage('Type must be user or bot'),
  body('language').optional().isIn(['en', 'ml']),
  body('intent').optional().isString(),
  body('confidence').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const { content, type, language = 'en', intent, confidence, metadata } = req.body;

    let conversation = await Conversation.findOne({ 
      userId: userId, 
      isActive: true 
    }).sort({ lastActivity: -1 });

    if (!conversation) {
      conversation = new Conversation({
        userId: userId,
        messages: [],
        context: {}
      });
    }

    const message = {
      type,
      content,
      language,
      intent,
      confidence,
      metadata,
      timestamp: new Date()
    };

    conversation.messages.push(message);
    conversation.lastActivity = new Date();

    // Keep only last 50 messages to manage storage
    if (conversation.messages.length > 50) {
      conversation.messages = conversation.messages.slice(-50);
    }

    await conversation.save();

    res.json({
      success: true,
      message: 'Message saved successfully',
      messageId: conversation.messages[conversation.messages.length - 1]._id
    });

  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save message'
    });
  }
});

// Update conversation context
router.put('/conversation/context', authenticateToken, [
  body('crop').optional().isString(),
  body('location').optional().isString(),
  body('farmingType').optional().isString(),
  body('experienceLevel').optional().isIn(['beginner', 'intermediate', 'expert'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const contextUpdate = req.body;

    let conversation = await Conversation.findOne({ 
      userId: userId, 
      isActive: true 
    }).sort({ lastActivity: -1 });

    if (!conversation) {
      conversation = new Conversation({
        userId: userId,
        messages: [],
        context: contextUpdate
      });
    } else {
      conversation.context = { ...conversation.context, ...contextUpdate };
      conversation.lastActivity = new Date();
    }

    await conversation.save();

    res.json({
      success: true,
      message: 'Context updated successfully',
      context: conversation.context
    });

  } catch (error) {
    console.error('Update context error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update context'
    });
  }
});

// Submit feedback
router.post('/feedback', authenticateToken, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().isLength({ max: 500 }),
  body('category').isIn(['accuracy', 'helpfulness', 'language', 'response_time', 'other']),
  body('conversationId').optional().isMongoId(),
  body('messageId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const { rating, feedback, category, conversationId, messageId } = req.body;

    const feedbackDoc = new Feedback({
      userId,
      conversationId,
      messageId,
      rating,
      feedback,
      category
    });

    await feedbackDoc.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedbackId: feedbackDoc._id
    });

  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
});

// Get conversation statistics (admin only)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const totalConversations = await Conversation.countDocuments();
    const activeConversations = await Conversation.countDocuments({ isActive: true });
    const totalMessages = await Conversation.aggregate([
      { $project: { messageCount: { $size: '$messages' } } },
      { $group: { _id: null, total: { $sum: '$messageCount' } } }
    ]);

    const feedbackStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const languageStats = await Conversation.aggregate([
      { $unwind: '$messages' },
      {
        $group: {
          _id: '$messages.language',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalConversations,
        activeConversations,
        totalMessages: totalMessages[0]?.total || 0,
        feedbackStats,
        languageStats
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
  }
});

// Clear conversation history
router.delete('/conversation', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await Conversation.updateMany(
      { userId: userId },
      { $set: { isActive: false } }
    );

    res.json({
      success: true,
      message: 'Conversation history cleared successfully'
    });

  } catch (error) {
    console.error('Clear conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear conversation history'
    });
  }
});

module.exports = router;