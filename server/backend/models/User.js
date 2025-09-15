const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true, // Allows null values while maintaining uniqueness
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // User Type - Updated to match your separate models
    role: {
      type: String,
      enum: ["farmer", "laborer", "retailer", "admin"], // Updated to match your models
      required: true,
    },

    // Basic Location Information (common for all users)
    location: {
      state: { type: String, required: false },
      district: { type: String, required: false },
      village: { type: String },
      pincode: { type: String },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },

    // Reference to detailed profile based on role
    profileRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'profileModel'
    },
    profileModel: {
      type: String,
      enum: ['Farmer', 'Laborer', 'Retailer', 'Admin']
    },

    // Common preferences for all users
    preferences: {
      language: { type: String, default: "en" },
      notifications: {
        weather: { type: Boolean, default: true },
        market: { type: Boolean, default: true },
        schemes: { type: Boolean, default: true },
        community: { type: Boolean, default: true },
      },
      units: {
        area: { type: String, enum: ["acres", "hectares"], default: "acres" },
        weight: { type: String, enum: ["kg", "quintal", "ton"], default: "kg" },
      },
    },

    // Verification Status (common for all users)
    verification: {
      isVerified: { type: Boolean, default: false },
      documents: [
        {
          type: { type: String }, // 'aadhar', 'land_record', 'license', etc.
          url: { type: String },
          status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
        },
      ],
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      verifiedAt: { type: Date },
    },

    // Activity Tracking
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },

    // Common ratings system
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
userSchema.index({ "location.state": 1, "location.district": 1 })
userSchema.index({ role: 1 })
userSchema.index({ "location.coordinates": "2dsphere" })
userSchema.index({ phone: 1 }, { unique: true })
userSchema.index({ email: 1 }, { unique: true, sparse: true })

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Set profileModel based on role
userSchema.pre("save", function (next) {
  if (this.isModified("role")) {
    const modelMap = {
      farmer: "Farmer",
      laborer: "Laborer", 
      retailer: "Retailer",
      admin: "Admin"
    }
    this.profileModel = modelMap[this.role]
  }
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Get public profile with populated detailed profile
userSchema.methods.getPublicProfile = async function () {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.verification.documents
  
  // Populate the detailed profile if profileRef exists
  if (this.profileRef) {
    await this.populate('profileRef')
    userObject.detailedProfile = this.profileRef
  }
  
  return userObject
}

// Static method to create user with detailed profile
userSchema.statics.createUserWithProfile = async function (userData) {
  const session = await mongoose.startSession()
  
  try {
    session.startTransaction()
    
    // Extract role-specific data
    const { role, profileData, ...baseUserData } = userData
    
    // Create the base user
    const user = new this({ ...baseUserData, role })
    await user.save({ session })
    
    // Create the detailed profile based on role
    let detailedProfile
    switch (role) {
      case 'farmer':
        const Farmer = mongoose.model('Farmer')
        detailedProfile = new Farmer({ userId: user._id, ...profileData })
        break
      case 'laborer':
        const Laborer = mongoose.model('Laborer')
        detailedProfile = new Laborer({ userId: user._id, ...profileData })
        break
      case 'retailer':
        const Retailer = mongoose.model('Retailer')
        detailedProfile = new Retailer({ userId: user._id, ...profileData })
        break
      case 'admin':
        const Admin = mongoose.model('Admin')
        detailedProfile = new Admin({ userId: user._id, ...profileData })
        break
      default:
        throw new Error('Invalid role specified')
    }
    
    await detailedProfile.save({ session })
    
    // Link the detailed profile to the user
    user.profileRef = detailedProfile._id
    await user.save({ session })
    
    await session.commitTransaction()
    
    return { user, detailedProfile }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

module.exports = mongoose.model("User", userSchema)