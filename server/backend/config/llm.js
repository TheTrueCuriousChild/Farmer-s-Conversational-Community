const { GoogleGenerativeAI } = require("@google/generative-ai")

const LLM_CONFIGS = {
  gemini: {
    model: "gemini-1.5-flash",
    maxTokens: 2048,
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
  },
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)

module.exports = {
  genAI,
  LLM_CONFIGS,
}
