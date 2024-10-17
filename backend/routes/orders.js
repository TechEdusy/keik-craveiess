// backend/routes/orders.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth"); // If admin-specific routes are needed
const Order = require("../models/Order");

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private (User)
router.post("/", auth, async (req, res) => {
  const { products, totalAmount } = req.body;

  // Basic validation
  if (!products || !totalAmount) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  try {
    const newOrder = new Order({
      user: req.user.id,
      products,
      totalAmount,
    });

    const order = await newOrder.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/orders
// @desc    Get all orders of the authenticated user
// @access  Private (User)
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("products.product", ["name", "price"])
      .sort({ orderedAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private (User/Admin)
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product", ["name", "price"])
      .populate("user", ["name", "email"]);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Ensure that the user requesting the order is either the owner or an admin
    if (order.user.id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status
// @access  Private (Admin)
router.put("/:id", auth, adminAuth, async (req, res) => {
  const { status } = req.body;

  // Validate status
  const validStatuses = ["Pending", "Processing", "Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ msg: "Invalid status value" });
  }

  try {
    let order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete an order
// @access  Private (Admin)
router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    await order.remove();
    res.json({ msg: "Order removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
