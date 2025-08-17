const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OtpModel");
const { User } = require("../models/User");

async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: 400, message: "User not found" });
    }

    // Get OTP record
    const record = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!record) {
      return res.status(400).json({ status: 400, message: "OTP not found" });
    }

    // Check expiry
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ status: 400, message: "OTP expired" });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, record.otpHash);
    if (!isMatch) {
      return res.status(400).json({ status: 400, message: "Invalid OTP" });
    }

    // OTP valid → issue reset token (expires in 10 min)
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // Delete OTP so it’s single-use
    await OTP.deleteMany({ email });

    return res.status(200).json({
      status: 200,
      message: "OTP verified successfully",
      resetToken: resetToken
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
}

module.exports = { verifyOTP };
