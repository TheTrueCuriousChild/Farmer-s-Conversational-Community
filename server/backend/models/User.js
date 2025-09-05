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
      required: true,
      unique: true,
      lowercase: true,
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

    // User Type
    role: {
      type: String,
      enum: ["farmer", "retailer", "labour", "expert", "admin"],
      required: true,
    },

    // Location Information
    location: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      village: { type: String },
      pincode: { type: String },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },

    // Profile Information (varies by role)
    profile: {
      // Farmer specific
      farmSize: { type: Number }, // in acres
      cropTypes: [{ type: String }],
      farmingExperience: { type: Number }, // in years
      landOwnership: { type: String, enum: ["owned", "leased", "sharecropping"] },
      irrigationType: { type: String, enum: ["rain-fed", "canal", "borewell", "drip", "sprinkler"] },

      // Retailer specific
      businessName: { type: String },
      businessType: { type: String, enum: ["seeds", "fertilizers", "pesticides", "equipment", "general"] },
      licenseNumber: { type: String },
      yearsInBusiness: { type: Number },

      // Labour specific
      skills: [{ type: String }],
      experience: { type: Number }, // in years
      dailyWage: { type: Number },
      availability: { type: String, enum: ["available", "busy", "seasonal"] },

      // Expert specific
      specialization: [{ type: String }],
      qualification: { type: String },
      certifications: [{ type: String }],
      consultationFee: { type: Number },
    },

    // Preferences
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

    // Verification Status
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

    // Ratings (for experts and retailers)
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
)

// Index for location-based queries
userSchema.index({ "location.state": 1, "location.district": 1 })
userSchema.index({ role: 1 })
userSchema.index({ "location.coordinates": "2dsphere" })

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

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Get public profile (exclude sensitive data)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.verification.documents
  return userObject
}

module.exports = mongoose.model("User", userSchema)
