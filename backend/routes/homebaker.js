// routes/homebaker.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const HomeBaker = require("../models/HomeBaker");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Middleware to check if the user is a Home Baker
const bakerAuth = async (req, res, next) => {
  if (req.user.role !== "homebaker") {
    return res.status(403).json({ msg: "Access denied: Home Bakers only" });
  }
  next();
};

// Configure Multer Storage with Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(file.originalname.split(".").pop());
    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG and PNG images are allowed"));
  },
});

// @route   GET /api/homebaker/profile
// @desc    Get Home Baker Profile
// @access  Private (Home Baker)
router.get("/profile", auth, bakerAuth, async (req, res) => {
  try {
    const baker = await HomeBaker.findById(req.user.id);
    if (!baker) {
      return res.status(404).json({ msg: "Home Baker not found" });
    }
    res.json(baker);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/homebaker/profile
// @desc    Update Home Baker Profile
// @access  Private (Home Baker)
router.put("/profile", auth, bakerAuth, async (req, res) => {
  const { bankDetails, addressProofs, pastOrders } = req.body;

  try {
    const baker = await HomeBaker.findById(req.user.id);
    if (!baker) {
      return res.status(404).json({ msg: "Home Baker not found" });
    }

    if (bankDetails) baker.bankDetails = bankDetails;
    if (addressProofs) baker.addressProofs = addressProofs;
    if (pastOrders) baker.pastOrders = pastOrders;

    await baker.save();
    res.json(baker);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const parser = multer({ storage: storage });

// @route   POST /api/homebaker/upload
// @desc    Upload images of past works
// @access  Private (Home Baker)
router.post(
  "/upload",
  auth,
  bakerAuth,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const baker = await HomeBaker.findById(req.user.id);
      if (!baker) {
        return res.status(404).json({ msg: "Home Baker not found" });
      }

      // Ensure files are uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: "No images uploaded" });
      }

      // Upload each file to Cloudinary and collect URLs
      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader
          .upload_stream(
            {
              folder: "keik-craveiess/pastWorks",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                throw new Error("Cloudinary upload failed");
              }
              return result.secure_url;
            }
          )
          .end(file.buffer);
      });

      // Since upload_stream uses callbacks, wrap in promises
      const uploadSingle = (file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "keik-craveiess/pastWorks",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );
          stream.end(file.buffer);
        });
      };

      const imageUrls = await Promise.all(req.files.map(uploadSingle));

      // Add image URLs to pastWorks
      const uploadedImages = imageUrls.map((url) => ({
        imageUrl: url,
        description: "", // Optional: You can allow adding descriptions
      }));

      baker.pastWorks.push(...uploadedImages);
      await baker.save();

      res.json({
        msg: "Images uploaded successfully",
        pastWorks: baker.pastWorks,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET /api/homebaker/pastworks
// @desc    Get all past works of the home baker
// @access  Private (Home Baker)
router.get("/pastworks", auth, bakerAuth, async (req, res) => {
  try {
    const baker = await HomeBaker.findById(req.user.id).select("pastWorks");
    if (!baker) {
      return res.status(404).json({ msg: "Home Baker not found" });
    }

    res.json(baker.pastWorks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/homebaker/orders
// @desc    Get all orders placed to the home baker with details and estimated arrival
// @access  Private (Home Baker)
router.get("/orders", auth, bakerAuth, async (req, res) => {
  try {
    const orders = await Order.find({ baker: req.user.id })
      .populate("user", ["name", "email"])
      .sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/homebaker/orders/:id
// @desc    Update order status (Home Baker)
// @access  Private (Home Baker)
router.put("/orders/:id", auth, bakerAuth, async (req, res) => {
  const { status } = req.body;

  // Validate status
  const validStatuses = ["In Progress", "Completed", "Cancelled"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ msg: "Invalid status value" });
  }

  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Ensure the order belongs to the home baker
    if (order.baker.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Access denied: Not your order" });
    }

    if (status) order.status = status;

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
