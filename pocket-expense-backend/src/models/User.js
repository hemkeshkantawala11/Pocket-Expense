const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  categories: { 
    type: [String], 
    default: ["Food", "Transport", "Bills"] 
  },
  paymentMethods: { 
    type: [String], 
    default: ["Cash", "Card", "UPI"] 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("User", userSchema)
