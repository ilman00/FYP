const express = require("express");
const router = express.Router();
const isAuthenticated = require('../middlewares/authMiddleware');
const { User, Student } = require('../models/User');

// Get all students for the logged-in guardian
router.get("/students", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "guardian") {
      return res.status(403).json({ message: "Only guardians can view student list" });
    }

    const students = await Student.find({ guardian: user.id });

    res.status(200).json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

module.exports = router;
