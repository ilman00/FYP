const express = require("express");
const writingProgress = require("../models/writingScoreModel")
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");


router.post("/api/writing", authMiddleware, async (req, res)=>{
    try{
        let studentId;
        if (req.user.role === "user") {
            studentId = req.user.id; 
        } else if (req.user.role === "teacher") {
            if (!req.body.studentId) {
                return res.status(400).json({ error: "Student ID is required for teachers" });
            }
            studentId = req.body.studentId; // The teacher specifies a student
        }

        const {handwriting_clarity, spelling_accuracy, grammar_mistakes, punctuation_errors} = req.body;

        const newWritingProgress = new writingProgress({
            studentId,
            handwriting_clarity,
            spelling_accuracy,
            grammar_mistakes,
            punctuation_errors
        });

        await newWritingProgress.save();

        res.status(201).json({ message: "Writing progress saved successfully" });

    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;