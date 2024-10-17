// routes/payment.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const HomeBaker = require("../models/HomeBaker");

// Middleware to check if the user is a Home Baker
const bakerAuth = async (req, res, next) => {
  if (req.user.role !== "homebaker") {
    return res.status(403).json({ msg: "Access denied: Home Bakers only" });
  }
  next();
};

// @route   POST /api/payment/subscribe
// @desc    Simulate subscription payment for Home Bakers
// @access  Private (Home Baker)
router.post("/subscribe", auth, bakerAuth, async (req, res) => {
  try {
    const baker = await HomeBaker.findById(req.user.id);
    if (!baker) {
      return res.status(404).json({ msg: "Home Baker not found" });
    }

    // Simulate payment success
    const currentDate = new Date();
    let newExpiry;

    if (baker.subscriptionExpiry && baker.subscriptionExpiry > currentDate) {
      // Extend existing subscription
      newExpiry = new Date(baker.subscriptionExpiry);
      newExpiry.setMonth(newExpiry.getMonth() + 1);
    } else {
      // New subscription
      newExpiry = new Date();
      newExpiry.setMonth(newExpiry.getMonth() + 1);
    }

    baker.subscriptionExpiry = newExpiry;
    await baker.save();

    res.json({
      msg: "Subscription activated successfully",
      subscriptionExpiry: baker.subscriptionExpiry,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
