const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Student } = require("../models/User");
const nodemailer = require("nodemailer")
require("dotenv").config();
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const {forgotPassword} = require("../controllers/authController")
const {verifyOTP} = require("../controllers/verifyOTP")
const { resetPassword } = require("../controllers/resetPassword")

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Gmail App Password
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, age } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!["user", "guardian"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists, Go to login Page." });

    const user = new User({ name, email, password, role, age });
    // 🔹 Create Email Verification Token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );




    await user.save();

    if (role === "user") {
      const student = new Student({
        name,
        guardian: user._id
      });
      await student.save();
    }

    // 🔹 Email Content
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const mailOptions = {
      from: `"" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
       <h2>Hello ${name},</h2>
       <p>Please verify your email by clicking the link below:</p>
       <a href="${verificationLink}">Verify Email</a>
     `
    };

    await transporter.sendMail(mailOptions); // password auto-hashed


    res.status(201).json({ message: "User registered! Verification email sent." });
  } catch (error) {
    console.error("Error in register route:", error);
    res.status(500).json({ message: "Server error", error });
  }
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
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: 400, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 400, message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      const verifyToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;

      await transporter.sendMail({
        from: `"My FYP App" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Verify your email",
        html: `
          <h2>Hello ${user.name},</h2>
          <p>Please verify your account by clicking the link below:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `
      });

      return res.status(403).json({
        status: 403,
        message: "Your email is not verified. A new verification link has been sent."
      });
    }

    // ✅ Only one token
    const token = generateAccessToken(user);

    res.json({
      status: 200,
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
});


router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/resend-otp", forgotPassword);
router.post("/auth/verify-otp", verifyOTP)
router.post("/auth/reset-password", resetPassword)

module.exports = router;
