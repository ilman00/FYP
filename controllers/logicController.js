const { User } = require("../models/User")
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const bcrypt = require("bcryptjs");
const transporter = require("../utils/transporter")


async function Login(req, res) {
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
}

module.exports = {Login}