const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { Student } = require("../models/User");

// Guardian creates a new student
router.post("/students", authMiddleware, async (req, res) => {
    try {
        const user = req.user;

        // Only guardians can create students
        if (user.role !== "guardian") {
            return res.status(403).json({ error: "Only a guardian can add a student" });
        }

        const newStudent = new Student({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            parent_history_dyslexia: req.body.parent_history_dyslexia,
            guardian: user._id // Fix the field name
        });

        await newStudent.save();

        res.status(201).json({ message: "Student created successfully", student: newStudent });
    } catch (error) {
        console.error("Student creation failed:", error);
        res.status(400).json({ error: "Failed to create student", details: error.message });
    }
});



// GET all students for the logged-in guardian
router.get('/students', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    // Only guardians can access this route
    if (user.role !== 'guardian') {
      return res.status(403).json({ error: 'Only a guardian can view students' });
    }

    // Find all students linked to this guardian
    const students = await Student.find({ guardian: user._id });

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students', details: error.message });
  }
});

module.exports = router;