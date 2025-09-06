const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const farmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
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
    farmLocation: {
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
    },
    farmSize: {
      type: Number,
      min: 0,
    },
    crops: [
      {
        type: String,
        enum: ["wheat", "rice", "corn", "vegetables", "fruits", "cotton", "other"],
      },
    ],
    certification: {
      type: String,
      enum: ["organic", "non-organic", "in-transition", "not-certified"],
      default: "not-certified",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
farmerSchema.index({ email: 1 }, { unique: true })
farmerSchema.index({ farmLocation: "2dsphere" })
farmerSchema.index({ status: 1 })

// Hash password before saving
farmerSchema.pre("save", async function (next) {
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
farmerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

farmerSchema.methods.getPublicProfile = function () {
  const farmer = this.toObject()
  delete farmer.password
  return farmer
}

module.exports = mongoose.model("Farmer", farmerSchema)
