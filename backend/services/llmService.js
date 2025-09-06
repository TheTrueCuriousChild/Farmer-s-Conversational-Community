const { genAI, LLM_CONFIGS } = require("../config/llm")

class LLMService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: LLM_CONFIGS.gemini.model })
    this.config = LLM_CONFIGS.gemini
  }

  async generateResponse(userMessage, context, ragResults) {
    try {
      // Build system prompt based on user context
      const systemPrompt = this.buildSystemPrompt(context)

      // Build context from RAG results
      const contextInformation = this.buildContextFromRAG(ragResults)

      // Prepare the full prompt
      const fullPrompt = `${systemPrompt}\n\nContext: ${contextInformation}\n\nQuestion: ${userMessage}`

      // Call Gemini API
      const result = await this.model.generateContent(fullPrompt)
      const response = await result.response
      const aiResponse = response.text()

      // Determine query type and confidence
      const queryType = this.classifyQuery(userMessage)
      const confidence = this.calculateConfidence(ragResults, aiResponse)

      return {
        content: aiResponse,
        queryType,
        confidence,
        tokens_used: aiResponse.length, // Approximate token count
      }
    } catch (error) {
      console.error("LLM Service Error:", error)
      throw new Error("Failed to generate AI response")
    }
  }

  buildSystemPrompt(context) {
    const { role, location, profile, preferences } = context

    let prompt = `You are KrishiSeva AI, an intelligent agricultural assistant for Indian farmers and agricultural stakeholders.

User Context:
- Role: ${role}
- Location: ${location.state}, ${location.district}
- Language Preference: ${preferences?.language || "en"}

Guidelines:
1. Provide practical, actionable advice specific to Indian agriculture
2. Consider local climate, soil conditions, and farming practices
3. Use simple, clear language
4. Include specific recommendations with quantities, timing, and methods
5. Mention government schemes when relevant
6. Always prioritize farmer safety and sustainable practices
7. If uncertain, recommend consulting local agricultural experts`

    // Add role-specific context
    if (role === "farmer") {
      prompt += `\n\nFarmer Profile:
- Farm Size: ${profile?.farmSize || "Not specified"} acres
- Crops: ${profile?.cropTypes?.join(", ") || "Not specified"}
- Experience: ${profile?.farmingExperience || "Not specified"} years
- Focus on: crop management, pest control, weather advice, market prices, government schemes`
    } else if (role === "retailer") {
      prompt += `\n\nRetailer Profile:
- Business: ${profile?.businessName || "Not specified"}
- Type: ${profile?.businessType || "Not specified"}
- Focus on: supply chain, market trends, inventory management, farmer connections`
    } else if (role === "labour") {
      prompt += `\n\nLabour Profile:
- Skills: ${profile?.skills?.join(", ") || "Not specified"}
- Experience: ${profile?.experience || "Not specified"} years
- Focus on: job opportunities, skill development, fair wages, safety`
    }

    return prompt
  }

  buildContextFromRAG(ragResults) {
    if (!ragResults.documents || ragResults.documents.length === 0) {
      return "No specific context found. Use general agricultural knowledge."
    }

    return ragResults.documents.map((doc, index) => `[Source ${index + 1}]: ${doc.content}`).join("\n\n")
  }

  classifyQuery(message) {
    const message_lower = message.toLowerCase()

    const queryPatterns = {
      crop_advice: ["crop", "plant", "grow", "harvest", "seed", "variety"],
      pest_disease: ["pest", "disease", "insect", "fungus", "infection", "treatment"],
      weather: ["weather", "rain", "temperature", "climate", "season"],
      market_price: ["price", "market", "sell", "cost", "rate", "mandi"],
      fertilizer: ["fertilizer", "nutrient", "manure", "compost", "urea"],
      irrigation: ["water", "irrigation", "drip", "sprinkler", "moisture"],
      government_scheme: ["scheme", "subsidy", "government", "yojana", "loan"],
      general: [],
    }

    for (const [queryType, keywords] of Object.entries(queryPatterns)) {
      if (keywords.some((keyword) => message_lower.includes(keyword))) {
        return queryType
      }
    }

    return "general"
  }

  calculateConfidence(ragResults, aiResponse) {
    let confidence = 0.5 // Base confidence

    // Increase confidence if relevant sources found
    if (ragResults.documents && ragResults.documents.length > 0) {
      confidence += Math.min(ragResults.documents.length * 0.1, 0.3)
    }

    // Increase confidence based on response specificity
    if (aiResponse.length > 200) confidence += 0.1
    if (aiResponse.includes("specific") || aiResponse.includes("recommended")) confidence += 0.1

    return Math.min(confidence, 1.0)
  }
}

module.exports = new LLMService()
