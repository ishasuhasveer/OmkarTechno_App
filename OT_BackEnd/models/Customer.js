const mongoose = require("mongoose");

// Customer schema as per Final OT_App Schema (without address)
const customerSchema = new mongoose.Schema(
  {
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
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true, //Firebase mobile notification
    },
    password: {
      type: String,
      required: true,
    }, // add password when created
    isVerified: {
      type: Boolean,
      default: false, // will be handled later if needed
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);


module.exports = mongoose.model("Customer", customerSchema);
