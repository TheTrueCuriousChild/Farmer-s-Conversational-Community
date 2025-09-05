const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
require("dotenv").config()

const connectDB = require("./config/db")
const errorHandler = require("./middlewares/errorHandler")

// Route imports
const authRoutes = require("./routes/authRoutes")

const app = express()

// Connect to database
connectDB()

// Middleware
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan("combined"))

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "KrishiSeva API is running",
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use("/api/auth", authRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 KrishiSeva Server running on port ${PORT}`)
  console.log(`📱 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err)
  process.exit(1)
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
  process.exit(1)
})
