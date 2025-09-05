const fs = require("fs")
const path = require("path")

class RAGService {
  constructor() {
    this.documents = []
    this.embeddings = new Map()
    this.loadDocuments()
  }

  loadDocuments() {
    try {
      // Load agricultural knowledge base
      this.documents = [
        {
          id: "crop_rotation_1",
          content:
            "Crop rotation is essential for maintaining soil health. In North India, a typical rotation includes wheat-rice-legume cycle. This helps prevent nutrient depletion and reduces pest buildup.",
          category: "crop_advice",
          region: "North India",
        },
        {
          id: "pest_management_1",
          content:
            "Integrated Pest Management (IPM) combines biological, cultural, and chemical methods. Use neem oil for aphids, introduce beneficial insects, and rotate crops to break pest cycles.",
          category: "pest_disease",
          region: "All India",
        },
        {
          id: "fertilizer_management_1",
          content:
            "Soil testing is crucial before fertilizer application. For rice, apply NPK in ratio 4:2:1. Use organic compost to improve soil structure and water retention.",
          category: "fertilizer",
          region: "All India",
        },
        {
          id: "weather_advice_1",
          content:
            "Monsoon timing is critical for kharif crops. Plant rice within 15 days of monsoon arrival. Late planting reduces yield by 10-15% per week delay.",
          category: "weather",
          region: "All India",
        },
        {
          id: "market_info_1",
          content:
            "Use e-NAM platform for better price discovery. Check mandi prices before selling. Storage for 2-3 months post-harvest often gives better prices.",
          category: "market_price",
          region: "All India",
        },
      ]
    } catch (error) {
      console.error("Error loading RAG documents:", error)
      this.documents = []
    }
  }

  async searchRelevantContent(query, userContext, limit = 5) {
    try {
      const queryLower = query.toLowerCase()
      const { role, location } = userContext

      // Score documents based on relevance
      const scoredDocuments = this.documents.map((doc) => {
        let score = 0

        // Text similarity (simple keyword matching)
        const docWords = doc.content.toLowerCase().split(" ")
        const queryWords = queryLower.split(" ")

        queryWords.forEach((word) => {
          if (docWords.some((docWord) => docWord.includes(word) || word.includes(docWord))) {
            score += 1
          }
        })

        // Category relevance
        const queryType = this.classifyQuery(query)
        if (doc.category === queryType) {
          score += 3
        }

        // Regional relevance
        if (doc.region === "All India" || doc.region === location.state) {
          score += 2
        }

        // Role-based relevance
        if (role === "farmer" && ["crop_advice", "pest_disease", "fertilizer", "weather"].includes(doc.category)) {
          score += 1
        }

        return { ...doc, score }
      })

      // Sort by score and return top results
      const relevantDocs = scoredDocuments
        .filter((doc) => doc.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

      return {
        documents: relevantDocs,
        sources: relevantDocs.map((doc) => doc.id),
        query_type: this.classifyQuery(query),
      }
    } catch (error) {
      console.error("RAG search error:", error)
      return {
        documents: [],
        sources: [],
        query_type: "general",
      }
    }
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
    }

    for (const [queryType, keywords] of Object.entries(queryPatterns)) {
      if (keywords.some((keyword) => message_lower.includes(keyword))) {
        return queryType
      }
    }

    return "general"
  }

  async addDocument(document) {
    try {
      const newDoc = {
        id: `custom_${Date.now()}`,
        content: document.content,
        category: document.category || "general",
        region: document.region || "All India",
        timestamp: new Date(),
      }

      this.documents.push(newDoc)
      return newDoc.id
    } catch (error) {
      console.error("Error adding document:", error)
      throw error
    }
  }
}

module.exports = new RAGService()
