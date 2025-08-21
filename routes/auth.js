const express = require("express");
const jwt = require("jsonwebtoken");
const { User, Student } = require("../models/User");
require("dotenv").config();
const { forgotPassword } = require("../controllers/authController")
const { verifyOTP } = require("../controllers/verifyOTP")
const { resetPassword } = require("../controllers/resetPassword")

const router = express.Router();
const {Login} = require("../controllers/logicController")


router.post("/register", async (req, res) => {
  
});

router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Invalid or missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(decoded.userId, { isVerified: true });

    res.json({ status: 200, message: "Your email has been verified. Please Login Again in the APP" });
  } catch (error) {
    res.status(400).json({ status: 400, message: "Invalid or expired token" });
  }
});




// Login Route
router.post("/login", Login);


router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/resend-otp", forgotPassword);
router.post("/auth/verify-otp", verifyOTP)
router.post("/auth/reset-password", resetPassword)

module.exports = router;
