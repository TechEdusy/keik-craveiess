// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const homeBakerRoutes = require("./routes/homebaker");
const userRoutes = require("./routes/user");
const paymentRoutes = require("./routes/payment");
const productRoutes = require("./routes/products");
const contactRoutes = require("./routes/contact");
const orderRoutes = require("./routes/orders"); // Import Order Routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/homebaker", homeBakerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes); // Use Order Routes

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to Keik Craveiess Backend!");
});

// Handle Undefined Routes
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ msg: "Server error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  