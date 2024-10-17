// routes/user.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const HomeBaker = require("../models/HomeBaker");
const Order = require("../models/Order");
const User = require("../models/user");

// Middleware to check if the user is a regular User
const userAuth = async (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ msg: "Access denied: Users only" });
  }
  next();
};

// @route   GET /api/user/bakers
// @desc    Get all active Home Bakers (subscription active)
// @access  Private (User)
router.get("/bakers", auth, userAuth, async (req, res) => {
  try {
    const currentDate = new Date();
    const bakers = await HomeBaker.find({
      subscriptionExpiry: { $gt: currentDate },
    });
    res.json(bakers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/user/order
// @desc    Place an order with a Home Baker
// @access  Private (User)
router.post("/order", auth, userAuth, async (req, res) => {
  const { bakerId, cakeDetails } = req.body;

  if (!bakerId || !cakeDetails) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  try {
    const baker = await HomeBaker.findById(bakerId);
    if (!baker) {
      return res.status(404).json({ msg: "Home Baker not found" });
    }

    // Check if subscription is active
    const currentDate = new Date();
    if (baker.subscriptionExpiry && baker.subscriptionExpiry < currentDate) {
      return res
        .status(400)
        .json({ msg: "Home Baker subscription has expired" });
    }

    const newOrder = new Order({
      user: req.user.id,
      baker: bakerId,
      cakeDetails,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/user/orders
// @desc    Get all orders placed by the user
// @access  Private (User)
router.get("/orders", auth, userAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("baker", ["name", "email"])
      .sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
