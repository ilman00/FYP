const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {User, Student} = require("../models/User");
// require("dotenv").config();

const router = express.Router();

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Register Route

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
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password, role, age }); // password auto-hashed
    await user.save();

    if (role === "user") {
      const student = new Student({
        name,
        guardian: user._id
      });
      await student.save();
    }

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error in register route:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
