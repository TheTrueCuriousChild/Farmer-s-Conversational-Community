const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const retailerSchema = new mongoose.Schema(
  {  role: 
    {type: String,
      required: true
    },
    businessName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    phone: {
      type: String,
      required: true,
      match: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    businessAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
    },
    businessType: {
      type: String,
      enum: ["supermarket", "grocery_store", "online_store", "wholesaler", "restaurant", "other"],
      default: "other",
    },
    licenseNumber: String,
    taxID: String,
    contactPerson: {
      name: String,
      position: String,
      mobile: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending_verification", "suspended"],
      default: "pending_verification",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
retailerSchema.index({ email: 1 }, { unique: true })
retailerSchema.index({ businessName: 1 })
retailerSchema.index({ "businessAddress.city": 1, "businessAddress.state": 1 })
retailerSchema.index({ status: 1 })

// Hash password before saving
retailerSchema.pre("save", async function (next) {
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
retailerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

retailerSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    businessName: this.businessName,
    email: this.email,
    phone: this.phone,
    businessAddress: this.businessAddress,
    businessType: this.businessType,
    licenseNumber: this.licenseNumber,
    taxID: this.taxID,
    contactPerson: this.contactPerson,
    status: this.status,
    rating: this.rating,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}


module.exports = mongoose.model("Retailer", retailerSchema)