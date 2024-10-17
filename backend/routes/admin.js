// routes/admin.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Admin = require("../models/admin");
const HomeBaker = require("../models/HomeBaker");
const User = require("../models/user");
const Order = require("../models/Order");

// Middleware to check if the user is an admin
const adminAuth = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied: Admins only" });
  }
  next();
};

// @route   GET /api/admin/homebakers
// @desc    Get all Home Bakers
// @access  Private (Admin)
router.get("/homebakers", auth, adminAuth, async (req, res) => {
  try {
    const bakers = await HomeBaker.find();
    res.json(bakers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE /api/admin/homebakers/:id
// @desc    Delete a Home Baker by ID
// @access  Private (Admin)
router.delete("/homebakers/:id", auth, adminAuth, async (req, res) => {
  try {
    const baker = await HomeBaker.findById(req.params.id);
    if (!baker) {
      return res.status(404).json({ msg: "Home Baker not found" });
    }

    await baker.remove();
    res.json({ msg: "Home Baker removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Home Baker not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   GET /api/admin/users
// @desc    Get all Users
// @access  Private (Admin)
router.get("/users", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a User by ID
// @access  Private (Admin)
router.delete("/users/:id", auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.remove();
    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders with user and baker details
// @access  Private (Admin)
router.get('/orders', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', ['name', 'email'])
      .populate('baker', ['name', 'email'])
      .sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/orders/:id
// @desc    Update order status
// @access  Private (Admin)
router.put('/orders/:id', auth, adminAuth, async (req, res) => {
  const { status, estimatedArrival } = req.body;

  // Validate status
  const validStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ msg: 'Invalid status value' });
  }

  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (status) order.status = status;
    if (estimatedArrival) order.estimatedArrival = estimatedArrival;

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
