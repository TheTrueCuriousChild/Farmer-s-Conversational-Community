const User = require("../models/User")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

// Register User
const register = async (req, res) => {
  try {
    const { email, phone, role } = req.body

    // Validate role
    if (!role || !["farmer", "laborer", "admin", "retailer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "A valid role is required (farmer, laborer, admin, retailer)",
      })
    }

    // Check if user already exists
    const orQuery = []
    if (email) orQuery.push({ email })
    if (phone) orQuery.push({ phone })
    const existingUser = await User.findOne({ $or: orQuery })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or phone number.",
      })
    }

    // Create new user with detailed profile
    const { user } = await User.createUserWithProfile(req.body)

    // Generate token
    const token = generateToken(user._id, user.role)
    const publicProfile = await user.getPublicProfile()

    // Return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: publicProfile,
        token,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors,
      })
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return res.status(400).json({
        success: false,
        message: `An account with this ${field} already exists.`,
      })
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    })
  }
}

// Login User
const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body

    if (!email && !phone) {
      return res.status(400).json({ success: false, message: "Email or phone is required." })
    }

    const query = email ? { email } : { phone }
    const user = await User.findOne(query).select("+password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id, user.role)
    const publicProfile = await user.getPublicProfile()

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: publicProfile,
        token,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    })
  }
}

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.user

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const publicProfile = await user.getPublicProfile()
    res.json({
      success: true,
      data: publicProfile,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    })
  }
}

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user
    const { profileData, ...baseUserData } = req.body

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete baseUserData.password
    delete baseUserData.email
    delete baseUserData.phone
    delete baseUserData.role

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: baseUserData },
      { new: true, runValidators: true },
    )

    if (user && profileData && Object.keys(profileData).length > 0) {
      const ProfileModel = mongoose.model(user.profileModel)
      await ProfileModel.findOneAndUpdate({ userId: user._id }, { $set: profileData })
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const publicProfile = await user.getPublicProfile()
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: publicProfile,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    })
  }
}

// Get Users by Role and Location
const getUsersByLocation = async (req, res) => {
  try {
    const { role, state, district, limit = 10 } = req.query

    if (!role || !["farmer", "laborer", "retailer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Valid role is required (farmer, laborer, retailer)",
      })
    }

    const query = { role }
    if (state) query["location.state"] = { $regex: state, $options: "i" }
    if (district) query["location.district"] = { $regex: district, $options: "i" }

    const users = await User.find(query).limit(Number.parseInt(limit)).sort({ createdAt: -1 })

    const publicProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await user.getPublicProfile()
        return profile
      }),
    )

    res.json({
      success: true,
      data: publicProfiles,
      count: publicProfiles.length,
    })
  } catch (error) {
    console.error("Get users by location error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get users",
      error: error.message,
    })
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getUsersByLocation,
}