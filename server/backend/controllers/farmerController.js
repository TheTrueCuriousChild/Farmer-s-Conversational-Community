const Farmer = require("../models/Farmer")

// Get all farmers
const getAllFarmers = async (req, res) => {
  try {
    const { page = 1, limit = 10, state, district, cropType } = req.query

    const query = {}
    if (state) query["farmLocation.state"] = state
    if (district) query["farmLocation.district"] = district
    if (cropType) query.crops = { $in: [cropType] }

    const farmers = await Farmer.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Farmer.countDocuments(query)

    res.json({
      success: true,
      data: farmers.map((farmer) => farmer.getPublicProfile()),
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
      message: "Failed to get farmers",
      error: error.message,
    })
  }
}

// Get farmer by ID
const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id).select("-password")

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      })
    }

    res.json({
      success: true,
      data: farmer.getPublicProfile(),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get farmer",
      error: error.message,
    })
  }
}

// Update farmer profile
const updateFarmer = async (req, res) => {
  try {
    const updates = req.body
    delete updates.password
    delete updates.email

    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password")

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      })
    }

    res.json({
      success: true,
      message: "Farmer updated successfully",
      data: farmer.getPublicProfile(),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update farmer",
      error: error.message,
    })
  }
}

module.exports = {
  getAllFarmers,
  getFarmerById,
  updateFarmer,
}
