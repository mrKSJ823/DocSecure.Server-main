const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserInfo } = require("../controllers/userControllers");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

console.log("User routes file loaded");

// User Registration Route
router.post("/register", registerUser);

// User Login Route
router.post("/login", loginUser);

// Protected admin route - requires Administrator role
router.get("/admin", authMiddleware, requireRole(['Administrator']), (req, res) => {
  res.json({ 
    message: "Welcome Administrator!", 
    user: req.user 
  });
});

// Protected citizen route - requires Citizen role
router.get("/citizen", authMiddleware, requireRole(['Citizen']), (req, res) => {
  res.json({ 
    message: "Welcome Citizen!", 
    user: req.user 
  });
});

// Test endpoint without middleware
router.get("/test", (req, res) => {
  console.log("Test endpoint hit!");
  res.json({ 
    message: "Test endpoint working!" 
  });
});

// Get user information - requires authentication
router.get("/getUserInfo", authMiddleware, getUserInfo);

// Protected route for both roles
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ 
    message: "Welcome to your profile!", 
    user: req.user 
  });
});

module.exports = router;
