const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const OTP = require("../models/OtpModel");

async function resetPassword(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ status: 401, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ status: 401, message: "Invalid token format" });
    }

    // Verify resetToken
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ status: 401, message: "Invalid or expired token" });
    }

    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ status: 400, message: "New password required" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await User.findByIdAndUpdate(payload.userId, { password: hashedPassword });

    // Cleanup OTPs for security
    await OTP.deleteMany({ email: payload.email });

    return res.status(200).json({
      status: 200,
      message: "Password reset successful. Please login with your new password."
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
}

module.exports = { resetPassword };
