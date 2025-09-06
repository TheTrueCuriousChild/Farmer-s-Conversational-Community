const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
      match: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["super_admin", "regional_admin", "support_admin", "audit_admin"],
      required: true,
    },
    personalInfo: {
      firstName: String,
      lastName: String,
      phone: String,
    },
    permissions: [
      {
        type: String,
        enum: ["user_management", "content_management", "reporting", "system_config", "audit_logs"],
      },
    ],
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      min: 0,
      default: 0,
    },
    lockedUntil: Date,
    status: {
      type: String,
      enum: ["active", "inactive", "locked"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
adminSchema.index({ username: 1 }, { unique: true })
adminSchema.index({ email: 1 }, { unique: true })
adminSchema.index({ role: 1 })
adminSchema.index({ status: 1 })

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}
adminSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    role: this.role,
    personalInfo: this.personalInfo,
    permissions: this.permissions,
    lastLogin: this.lastLogin,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}


module.exports = mongoose.model("Admin", adminSchema)
