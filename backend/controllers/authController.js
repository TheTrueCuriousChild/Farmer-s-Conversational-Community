const Farmer = require("../models/Farmer")
const Laborer = require("../models/Laborer")
const Admin = require("../models/Admin")
const Retailer = require("../models/Retailer")
const jwt = require("jsonwebtoken")

// Helper function to get the correct model based on user type
const getUserModel = (userType) => {
  const models = {
    farmer: Farmer,
    laborer: Laborer,
    admin: Admin,
    retailer: Retailer,
  }
  return models[userType]
}

// Generate JWT Token
const generateToken = (userId, userType) => {
  return jwt.sign({ userId, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

// Register User
const register = async (req, res) => {
  try {
    const { userType, ...userData } = req.body

    // Validate userType
    if (!userType || !["farmer", "laborer", "admin", "retailer"].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: "Valid userType is required (farmer, laborer, admin, retailer)",
      })
    }

    const UserModel = getUserModel(userType)

    // Check if user already exists (check across all user types)
    const existingChecks = []
    
    // Check farmer model
    if (userData.email || userData.phone) {
      existingChecks.push(
        Farmer.findOne({ 
          $or: [
            ...(userData.email ? [{ email: userData.email }] : []),
            ...(userData.phone ? [{ phone: userData.phone }] : [])
          ] 
        })
      )
    }
    
    // Check laborer model  
    if (userData.phone) {
      existingChecks.push(Laborer.findOne({ phone: userData.phone }))
    }
    
    // Check admin model
    if (userData.email || userData.username) {
      existingChecks.push(
        Admin.findOne({ 
          $or: [
            ...(userData.email ? [{ email: userData.email }] : []),
            ...(userData.username ? [{ username: userData.username }] : [])
          ] 
        })
      )
    }
    
    // Check retailer model
    if (userData.email || userData.phone) {
      existingChecks.push(
        Retailer.findOne({ 
          $or: [
            ...(userData.email ? [{ email: userData.email }] : []),
            ...(userData.phone ? [{ phone: userData.phone }] : [])
          ] 
        })
      )
    }

    const existingUsers = await Promise.all(existingChecks)

    if (existingUsers.some((user) => user !== null)) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email, phone, or username",
      })
    }

    // Create new user with specific model
    const user = new UserModel(userData)
    await user.save()

    // Generate token
    const token = generateToken(user._id, userType)

    // Return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: user.getPublicProfile(),
        userType,
        token,
      },
    })
    
  } catch (error) {
    console.error("Registration error:", error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message)
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
        message: `${field} already exists`,
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
    const { email, password, username, phone } = req.body

    let user = null
    let userType = null

    // Search across all user types
    if (email) {
      // Check farmers
      user = await Farmer.findOne({ email })
      if (user) {
        userType = "farmer"
      }
      
      // Check laborers (if they have email)
      if (!user) {
        user = await Laborer.findOne({ email })
        if (user) userType = "laborer"
      }
      
      // Check retailers
      if (!user) {
        user = await Retailer.findOne({ email })
        if (user) userType = "retailer"
      }
      
      // Check admins
      if (!user) {
        user = await Admin.findOne({ email })
        if (user) userType = "admin"
      }
    }

    // Check by phone (for laborers primarily)
    if (!user && phone) {
      user = await Laborer.findOne({ phone })
      if (user) userType = "laborer"
      
      if (!user) {
        user = await Farmer.findOne({ phone })
        if (user) userType = "farmer"
      }
      
      if (!user) {
        user = await Retailer.findOne({ phone })
        if (user) userType = "retailer"
      }
    }

    // For admin, also check username
    if (!user && username) {
      user = await Admin.findOne({ username })
      if (user) userType = "admin"
    }

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

    // Update last login if field exists
    if (user.schema.paths.lastLogin) {
      user.lastLogin = new Date()
      await user.save()
    }

    // Generate token
    const token = generateToken(user._id, userType)

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: user.getPublicProfile(),
        userType,
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
    const { userId, userType } = req.user
    const UserModel = getUserModel(userType)

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      data: {
        ...user.getPublicProfile(),
        userType,
      },
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
    const { userId, userType } = req.user

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password
    delete updates.email
    delete updates.username

    const UserModel = getUserModel(userType)
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true },
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        ...user.getPublicProfile(),
        userType,
      },
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
    const { userType, state, district, limit = 10 } = req.query

    if (!userType || !["farmer", "laborer", "retailer"].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: "Valid userType is required (farmer, laborer, retailer)",
      })
    }

    const UserModel = getUserModel(userType)
    const query = {}

    if (state || district) {
      if (userType === "farmer") {
        // Farmer model uses farmLocation.address (string field)
        if (state || district) {
          const locationRegex = []
          if (state) locationRegex.push(state)
          if (district) locationRegex.push(district)
          query["farmLocation.address"] = { $regex: locationRegex.join("|"), $options: "i" }
        }
      } else if (userType === "laborer") {
        // Laborer model has location.district and location.village
        if (state) query["location.address"] = { $regex: state, $options: "i" }
        if (district) query["location.district"] = district
      } else if (userType === "retailer") {
        // Retailer model uses businessAddress.state
        if (state) query["businessAddress.state"] = state
        if (district) query["businessAddress.city"] = district // Using city as district equivalent
      }
    }

    const users = await UserModel.find(query)
      .select("-password")
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: users.map((user) => ({
        ...user.getPublicProfile(),
        userType,
      })),
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