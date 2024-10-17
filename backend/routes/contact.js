// backend/routes/contact.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer"); // For sending emails
require("dotenv").config();

// @route   POST /api/contact
// @desc    Handle contact form submission
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ msg: "Please fill in all fields." });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Please enter a valid email address." });
  }

  try {
    // Optional: Save to database
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();

    // Optional: Send email notification
    const transporter = nodemailer.createTransport({
      service: "Gmail", // e.g., Gmail, Outlook, etc.
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    const mailOptions = {
      from: email, // Sender's email
      to: process.env.ADMIN_EMAIL, // Your admin email to receive messages
      subject: `Contact Form: ${subject}`,
      text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        // Even if email fails, consider the submission successful
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json({ msg: "Your message has been sent successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
