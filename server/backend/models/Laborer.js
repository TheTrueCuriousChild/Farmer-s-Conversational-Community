const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const laborerSchema = new mongoose.Schema(
  {  userType: {
  type: String,
  enum: ["farmer", "laborer", "retailer", "admin"], // Changed "labour" to "laborer"
  required: false,
  default: "laborer"
},
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
    },
    alternatePhone: {
      type: String,
      match: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
    },
    email: {
  type: String,
  unique: true,
  lowercase: true,
  sparse: true, // Add this - allows null values while maintaining uniqueness
  required: false, // Make it optional
},
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    skills: [
      {
        type: String,
        enum: [
          "planting",
          "harvesting",
          "irrigation",
          "pruning",
          "pest_control",
          "machine_operation",
          "packing",
          "other",
        ],
        required: true,
      },
    ],
    experience: {
      type: Number,
      min: 0,
    },
    availability: {
      type: String,
      enum: ["full_time", "part_time", "seasonal", "available", "not_available"],
      default: "available",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (coords) =>
            coords.length === 2 && coords[0] >= -180 && coords[0] <= 180 && coords[1] >= -180 && coords[1] <= 180,
        },
      },
      address: {
        type: String,
        required: true,
      },
      village: String,
      district: String,
    },
    wageExpectation: {
      daily: {
        type: Number,
        min: 0,
      },
      hourly: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },
    documents: [
      {
        type: String,
        number: String,
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    status: {
      type: String,
      enum: ["available", "working", "not_available", "blacklisted"],
      default: "available",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
laborerSchema.index({ phone: 1 }, { unique: true })
laborerSchema.index({ location: "2dsphere" })
laborerSchema.index({ skills: 1 })
laborerSchema.index({ availability: 1 })
laborerSchema.index({ status: 1 })

// Hash password before saving
laborerSchema.pre("save", async function (next) {
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
laborerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Get public profile method - ADD THIS METHOD
laborerSchema.methods.getPublicProfile = function () {
  const laborer = this.toObject()

  // Remove sensitive fields
  delete laborer.password
  delete laborer.__v

  // Return the public profile with all necessary fields
  return {
    _id: laborer._id,
    name: laborer.name,
    phone: laborer.phone,
    alternatePhone: laborer.alternatePhone,
    skills: laborer.skills,
    experience: laborer.experience,
    availability: laborer.availability,
    location: laborer.location,
    wageExpectation: laborer.wageExpectation,
    documents: laborer.documents,
    rating: laborer.rating,
    status: laborer.status,
    createdAt: laborer.createdAt,
    updatedAt: laborer.updatedAt,
  }
}

module.exports = mongoose.model("Laborer", laborerSchema)