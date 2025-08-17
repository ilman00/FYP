const express = require("express");
const ModelParameter = require("../models/ModelParameters");
const authMiddleware = require("../middlewares/authMiddleware");
const modelPrediction = require("../ml/predictEnglishSpeaker");

const router = express.Router();

router.post("/submit-english-speaker-test", authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    let prediction = null;

    // Run model prediction only if manual label not provided
    if (data.diagnosedDyslexic === undefined || data.diagnosedDyslexic === null) {
      const predictionPayload = {
        age: data.age,
        phonemeMatching_score: data.phonemeMatching?.score,
        phonemeMatching_time: data.phonemeMatching?.time,
        phonemeMatching_errorsCount: data.phonemeMatching?.errorsCount,

        letterRecognition_score: data.letterRecognition?.score,
        letterRecognition_time: data.letterRecognition?.time,
        letterRecognition_errorsCount: data.letterRecognition?.errorsCount,

        attention_score: data.attention?.score,
        attention_time: data.attention?.time,
        attention_errorsCount: data.attention?.errorsCount,

        patternMemory_score: data.patternMemory?.score,
        patternMemory_time: data.patternMemory?.time,
        patternMemory_errorsCount: data.patternMemory?.errorsCount,

        // Reading task (flattened for model input, no wrongWords)
        reading_pronunciationAccuracy: data.reading?.pronunciationAccuracy,
        reading_readingSpeedWpm: data.reading?.readingSpeedWpm,
        reading_timeTaken: data.reading?.timeTaken,
        reading_totalErrors: data.reading?.totalErrors,
        reading_totalScore: data.reading?.totalScore,
        reading_readingFluency: data.reading?.readingFluency,

        letterReversalCount: data.letterReversalCount,
        ageStartedReading: data.ageStartedReading,
        familyHistoryOfDyslexia: data.familyHistoryOfDyslexia
      };

      prediction = await modelPrediction(predictionPayload); // returns 0/1
    }

    // Determine student/guardian IDs based on role
    let studentId, guardianId;
    if (req.user.role === "guardian") {
      studentId = data.student; // Provided by guardian
      guardianId = req.user.id;
    } else {
      studentId = req.user.id;
      guardianId = null;
    }

    const result = new ModelParameter({
      student: studentId,
      guardian: guardianId,
      age: data.age,

      phonemeMatching: data.phonemeMatching,
      letterRecognition: data.letterRecognition,
      attention: data.attention,
      patternMemory: data.patternMemory,

      reading: {
        pronunciationAccuracy: data.reading?.pronunciationAccuracy,
        readingSpeedWpm: data.reading?.readingSpeedWpm,
        timeTaken: data.reading?.timeTaken,
        totalErrors: data.reading?.totalErrors,
        totalScore: data.reading?.totalScore,
        readingFluency: data.reading?.readingFluency
      },

      letterReversalCount: data.letterReversalCount,
      ageStartedReading: data.ageStartedReading,
      familyHistoryOfDyslexia: data.familyHistoryOfDyslexia,

      diagnosedDyslexic: data.diagnosedDyslexic ?? prediction,
      diagnosedByModel: prediction
    });

    await result.save();

    res.status(201).json({
      success: true,
      message: "English test result saved",
      result
    });

  } catch (err) {
    console.error("Error in English test API:", err);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
});

module.exports = router;
