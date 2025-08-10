const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { Student } = require("../models/User");

// Guardian creates a new student
router.post("/create-student", authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        console.log("Loged In User: ", req.user);

        // Only guardians can create students
        if (user.role !== "guardian") {
            return res.status(403).json({ error: "Only a guardian can add a student" });
        }

        const newStudent = new Student({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            parent_history_dyslexia: req.body.parent_history_dyslexia,
            guardian: user.id // Fix the field name
        });

        await newStudent.save();

        res.status(201).json({ message: "Student created successfully", student: newStudent });
    } catch (error) {
        console.error("Student creation failed:", error);
        res.status(400).json({ error: "Failed to create student", details: error.message });
    }
});



// GET all students for the logged-in guardian


module.exports = router;