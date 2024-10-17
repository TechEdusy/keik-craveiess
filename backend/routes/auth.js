// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");
const HomeBaker = require("../models/HomeBaker");
const User = require("../models/user");

// @route   POST /api/auth/register
// @desc    Register a new user, home baker, or admin
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body; // role: 'admin', 'homebaker', 'user'

  try {
    let existingUser;

    if (role === "admin") {
      existingUser = await Admin.findOne({ email });
    } else if (role === "homebaker") {
      existingUser = await HomeBaker.findOne({ email });
    } else {
      existingUser = await User.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    let newUser;
    if (role === "admin") {
      newUser = new Admin({ name, email, password });
    } else if (role === "homebaker") {
      newUser = new HomeBaker({ name, email, password });
    } else {
      newUser = new User({ name, email, password });
    }

    await newUser.save();

    res
      .status(201)
      .json({
        msg: `${
          role.charAt(0).toUpperCase() + role.slice(1)
        } registered successfully`,
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/auth/login
// @desc    Login user, home baker, or admin and return JWT
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body; // role: 'admin', 'homebaker', 'user'

  try {
    let user;
    if (role === "admin") {
      user = await Admin.findOne({ email });
    } else if (role === "homebaker") {
      user = await HomeBaker.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Token valid for 7 days
      (err, token) => {
        if (err) throw err;
        res.json({ token, role });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
