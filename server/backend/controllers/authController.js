const User = require("../models/User")
const jwt = require("jsonwebtoken")

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

// Register User
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, location, profile, preferences } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or phone",
      })
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
      role,
      location,
      profile,
      preferences,
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: user.getPublicProfile(),
        token,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    })
  }
}

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
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
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: user.getPublicProfile(),
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
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      data: user.getPublicProfile(),
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
    const updates = req.body

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password
    delete updates.email
    delete updates.verification

    const user = await User.findByIdAndUpdate(req.user.userId, { $set: updates }, { new: true, runValidators: true })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user.getPublicProfile(),
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

    const query = {}
    if (role) query.role = role
    if (state) query["location.state"] = state
    if (district) query["location.district"] = district

    const users = await User.find(query)
      .select("-password -verification.documents")
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: users,
      count: users.length,
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
