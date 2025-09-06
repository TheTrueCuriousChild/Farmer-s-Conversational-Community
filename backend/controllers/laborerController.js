const Laborer = require("../models/Laborer")

// Get all laborers
const getAllLaborers = async (req, res) => {
  try {
    const { page = 1, limit = 10, state, district, skill, availability } = req.query

    const query = {}
    if (state) query["location.state"] = state
    if (district) query["location.district"] = district
    if (skill) query.skills = { $in: [skill] }
    if (availability) query.availability = availability

    const laborers = await Laborer.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Laborer.countDocuments(query)

    res.json({
      success: true,
      data: laborers.map((laborer) => laborer.getPublicProfile()),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get laborers",
      error: error.message,
    })
  }
}

// Get laborer by ID
const getLaborerById = async (req, res) => {
  try {
    const laborer = await Laborer.findById(req.params.id).select("-password")

    if (!laborer) {
      return res.status(404).json({
        success: false,
        message: "Laborer not found",
      })
    }

    res.json({
      success: true,
      data: laborer.getPublicProfile(),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get laborer",
      error: error.message,
    })
  }
}

module.exports = {
  getAllLaborers,
  getLaborerById,
}
