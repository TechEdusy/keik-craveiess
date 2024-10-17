// backend/controllers/orderController.js
const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

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
};
