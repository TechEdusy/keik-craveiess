// models/HomeBaker.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const HomeBakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bankDetails: { type: String },
  addressProofs: { type: String }, // URLs or file paths
  pastOrders: [
    {
      image: String,
      description: String,
      date: { type: Date, default: Date.now },
    },
  ],
  pastWorks: [
    {
      imageUrl: { type: String },
      description: { type: String },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  subscriptionExpiry: { type: Date },
});

// Hash password before saving
HomeBakerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("HomeBaker", HomeBakerSchema);
