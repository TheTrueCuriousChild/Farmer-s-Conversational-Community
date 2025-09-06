const express = require("express")
const { getAllFarmers, getFarmerById, updateFarmer } = require("../controllers/farmerController")
const { authMiddleware, requireRole } = require("../middlewares/authMiddleware")

const router = express.Router()

// Public routes
router.get("/", getAllFarmers)
router.get("/:id", getFarmerById)

// Protected routes
router.put("/:id", authMiddleware, requireRole(["farmer", "admin"]), updateFarmer)

module.exports = router
