const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
require("dotenv").config()

const connectDB = require("./config/db")
const errorHandler = require("./middlewares/errorHandler")

// Route imports
const authRoutes = require("./routes/authRoutes")
const farmerRoutes = require("./routes/farmerRoutes")
const laborerRoutes = require("./routes/laborerRoutes")
const aiRoutes = require("./routes/aiRoutes") // AI routes
const contactRoutes = require("./routes/contactRoutes");
const jiomartRoutes = require("./routes/jiomartRoutes");

const app = express()

// Connect to database
connectDB()

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan("combined"))

// Health check
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "KrishiSeva API is running",
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use("/auth", authRoutes)
app.use("/farmers", farmerRoutes)
app.use("/laborers", laborerRoutes)
app.use("/ai", aiRoutes) // AI routes
app.use("/contact", contactRoutes); // Contact Us & IVR endpoints
app.use("/jiomart", jiomartRoutes); // JioMart recommendation endpoints

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
  console.log(`📱 Health check: http://localhost:${PORT}/test`)
  console.log(`🔗 API Base URL: http://localhost:${PORT}/`)
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