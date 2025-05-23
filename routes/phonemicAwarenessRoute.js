const express = require("express");
const router = express.Router();
const PhonemicResponse = require("../models/phonemicAwarenessModel");

router.post("/phonemic-awareness/submit", async (req, res) => {
  const { userId, questionId, userResponse, correctAnswer } = req.body;

  const isCorrect = userResponse === correctAnswer;

  const newResponse = new PhonemicResponse({
    userId,
    activityType: "identification",
    questionId,
    userResponse,
    isCorrect
  });

  await newResponse.save();
  res.json({ success: true, isCorrect });
});

module.exports = router;
