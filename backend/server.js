// const express = require("express")
// const cors = require("cors")
// const morgan = require("morgan")
// require("dotenv").config()

// const connectDB = require("./config/db")
// const errorHandler = require("./middlewares/errorHandler")

// // Route imports
// const authRoutes = require("./routes/authRoutes")
// const farmerRoutes = require("./routes/farmerRoutes")
// const laborerRoutes = require("./routes/laborerRoutes")

// const app = express()

// // Connect to database
// connectDB()

// // Middleware
// app.use(cors())
// app.use(express.json({ limit: "10mb" }))
// app.use(express.urlencoded({ extended: true }))
// app.use(morgan("combined"))

// // Health check
// app.get("/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "KrishiSeva API is running",
//     timestamp: new Date().toISOString(),
//   })
// })

// // API Routes
// app.use("/auth", authRoutes)
// app.use("/farmers", farmerRoutes)
// app.use("/laborers", laborerRoutes)

// // 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   })
// })

// // Error handling middleware
// app.use(errorHandler)

// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => {
//   console.log(`🚀 KrishiSeva Server running on port ${PORT}`)
//   console.log(`📱 Health check: http://localhost:${PORT}/health`)
//   console.log(`🔗 API Base URL: http://localhost:${PORT}/`)
// })

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (err) => {
//   console.error("Unhandled Promise Rejection:", err)
//   process.exit(1)
// })

// // Handle uncaught exceptions
// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err)
//   process.exit(1)
// })



// -------------------

// ✅ Connect to Moimport express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

// Contact form route
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log("New contact form submission:", { name, email, message });

  res.status(200).json({ success: true, msg: "Message received" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
ngoDB
mongoose.connect("mongodb://localhost:27017/farmerSupport", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", contactSchema);

// ✅ API: Submit query
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, Email and Message are required" });
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    res.json({ success: true, message: "Your query has been submitted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Server error, try again later." });
  }
});

// ✅ API: Admin fetch all queries
app.get("/api/contact", async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

// ✅ Start server
app.listen(3000, () => console.log("🚀 Backend running on http://localhost:3000"));
