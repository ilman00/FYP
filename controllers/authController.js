const { User } = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const OTP = require("../models/OtpModel");
const nodemailer = require("nodemailer")
// You should import/send via nodemailer or any email service
// const sendEmail = require("../utils/sendEmail")


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Gmail App Password
  }
});

// Generate 6-digit OTP
function generateOTP() {
  const otp = crypto.randomInt(100000, 999999);
  return otp.toString();
}

// Hash OTP with bcrypt
async function hashOTP(otp) {
  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(otp, salt);
  return hashedOTP;
}

// Save OTP to DB with expiry
async function saveOTP(email, otp) {
  const otpHash = await hashOTP(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

  // Delete previous OTPs for same email (optional)
  await OTP.deleteMany({ email });

  // Save new OTP
  await OTP.create({ email, otpHash, expiresAt });
}

// Forgot password controller
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const verifyUser = await User.findOne({ email });
    if (!verifyUser) {
      return res
        .status(400)
        .json({ status: 400, message: "Your Email is Wrong" });
    }

    const otp = generateOTP();

    await saveOTP(email, otp);

   
    await transporter.sendMail({
      from: `"My FYP App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for the Reset Password",
      html: `
        <h2>Hello ${verifyUser.name},</h2>
        <p>Use below 6 digit pin to reset your password</p>
        <h4>Your OTP ${otp}</h4>
        <p>This OTP will expire in 10 minuts.</p>
      `
    });

    return res.status(200).json({
      status: 200,
      message: "OTP sent successfully to your email",
      // Remove this in production (only return message)
      otp: otp, // <— return OTP only for testing/dev
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
}

module.exports = { forgotPassword };
