const express = require("express")
const { getAllLaborers, getLaborerById } = require("../controllers/laborerController")

const router = express.Router()

// Public routes
router.get("/", getAllLaborers)
router.get("/:id", getLaborerById)

module.exports = router
