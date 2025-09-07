const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Rate limiting for AI requests
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each user to 30 requests per windowMs
  message: { 
    success: false, 
    message: 'Too many AI requests, please try again later' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation middleware
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

// Helper function to call AI service
async function callAIService(endpoint, data) {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}${endpoint}`, data, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`AI Service Error: ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      throw new Error('AI service is not available. Please try again later.');
    }
    if (error.response) {
      throw new Error(error.response.data.detail || 'AI service error');
    }
    throw new Error('Failed to connect to AI service');
  }
}

// Health check for AI service
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 5000 });
    res.json({
      success: true,
      message: 'AI service is healthy',
      ai_service_status: response.data
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'AI service is unavailable',
      error: error.message
    });
  }
});

// Main chat endpoint
router.post('/chat', aiLimiter, authMiddleware, validateChatInput, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: errors.array()
      });
    }

    const { message, language = 'en' } = req.body;
    const userId = req.user.userId; // Using your auth structure

    const aiRequest = {
      user_id: userId.toString(),
      message: message,
      language: language
    };

    const aiResponse = await callAIService('/chat', aiRequest);

    console.log(`Chat - User: ${userId}, Intent: ${aiResponse.intent}, Language: ${language}`);

    res.json({
      success: true,
      data: {
        response: aiResponse.response,
        intent: aiResponse.intent,
        confidence: aiResponse.confidence,
        language: aiResponse.language,
        suggestions: aiResponse.suggestions || []
      },
      message: 'Query processed successfully'
    });

  } catch (error) {
    console.error('AI Chat Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process your question',
      data: null
    });
  }
});

// Get conversation history
router.get('/conversation', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const response = await axios.get(`${AI_SERVICE_URL}/conversation/${userId}`, {
      timeout: 10000
    });

    res.json({
      success: true,
      data: response.data,
      message: 'Conversation history retrieved successfully'
    });

  } catch (error) {
    console.error('Conversation History Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversation history',
      data: null
    });
  }
});

// Quick query endpoint for common questions
router.post('/quick-query', authMiddleware, [
  body('query_type').isIn(['weather', 'prices', 'diseases', 'pests', 'fertilizer']),
  body('crop').optional().isString().isLength({ max: 50 }),
  body('location').optional().isString().isLength({ max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const { query_type, crop = '', location = '' } = req.body;
    const userId = req.user.userId;
    const language = 'en'; // Default to English for quick queries

    // Generate quick query message
    const quickQueries = {
      weather: `What's the weather forecast for ${location}? How will it affect ${crop} farming?`,
      prices: `What are the current market prices for ${crop}${location ? ` in ${location}` : ''}?`,
      diseases: `What are common diseases affecting ${crop} and how to treat them?`,
      pests: `What pests commonly attack ${crop} and how to control them?`,
      fertilizer: `What fertilizers should I use for ${crop} cultivation?`
    };

    const message = quickQueries[query_type] || `Tell me about ${crop} farming.`;

    // Call AI service
    const aiResponse = await callAIService('/chat', {
      user_id: userId.toString(),
      message: message,
      language: language
    });

    res.json({
      success: true,
      data: {
        query_type: query_type,
        response: aiResponse.response,
        suggestions: aiResponse.suggestions
      },
      message: 'Quick query processed successfully'
    });

  } catch (error) {
    console.error('Quick Query Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process quick query',
      data: null
    });
  }
});

module.exports = router;