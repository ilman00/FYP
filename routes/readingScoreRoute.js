const express = require("express");
const ReadingProgress = require("../models/readingScoreModel"); // Import model
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/reading" ,async (req, res) => {
    // console.log(req.user.id)
    try{
        const readingScore = req.body.readingScore;
        const readingErrors = req.body.readingErrors;
        const readingTime = req.body.readingTime;
        // const studentId = req.user._id;

        const newReading = await ReadingProgress.create({
            // studentId,
            readingScore,
            readingErrors,
            readingTime,
        })

        res.status(200).json(newReading);
    }catch(err){
        res.status(500).json({ message: "Something went wrong!" });
    }
});

module.exports = router;
