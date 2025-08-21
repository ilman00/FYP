const {User, Student} = require("../models/User")
const jwt = require("jsonwebtoken")
const transporter = require("../utils/transporter")

async function Register(req, res){
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
}