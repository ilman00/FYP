// routes/englishTest.js
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const EnglishTestResult = require("../models/ModelParameters"); // your schema from above
const {User} = require("../models/User"); // ensure it has isDyslexicPredicted, lastPredictionDate
const modelPrediction = require("../ml/predictEnglishSpeaker");

const router = express.Router();

// Map the saved document to the 22-feature flat payload the model expects
function toPredictionPayloadFromDoc(doc) {
  return {
    // Phoneme Matching (3)
    phonemeMatching_score: doc.phonemeMatching?.score,
    phonemeMatching_time: doc.phonemeMatching?.time,
    phonemeMatching_errorsCount: doc.phonemeMatching?.errorsCount,

    // Letter Recognition (3)
    letterRecognition_score: doc.letterRecognition?.score,
    letterRecognition_time: doc.letterRecognition?.time,
    letterRecognition_errorsCount: doc.letterRecognition?.errorsCount,

    // Attention (3)
    attention_score: doc.attention?.score,
    attention_time: doc.attention?.time,
    attention_errorsCount: doc.attention?.errorsCount,

    // Pattern Memory (3)
    patternMemory_score: doc.patternMemory?.score,
    patternMemory_time: doc.patternMemory?.time,
    patternMemory_errorsCount: doc.patternMemory?.errorsCount,

    // Reading (6)
    reading_pronunciationAccuracy: doc.reading?.pronunciationAccuracy,
    reading_readingSpeedWpm: doc.reading?.readingSpeedWpm,
    reading_timeTaken: doc.reading?.timeTaken,
    reading_totalErrors: doc.reading?.totalErrors,
    reading_totalScore: doc.reading?.totalScore,
    reading_readingFluency: doc.reading?.readingFluency,

    // Other (4)
    letterReversalCount: doc.letterReversalCount,
    ageStartedReading: doc.ageStartedReading,
    familyHistoryOfDyslexia: doc.familyHistoryOfDyslexia,
    age: doc.age
  };
}

// Build DB document from request body
function buildDocFromRequest(data, studentId, guardianId) {
  return {
    student: studentId,
    guardian: guardianId || undefined,
    age: data.age,

    phonemeMatching: data.phonemeMatching || {},
    letterRecognition: data.letterRecognition || {},
    attention: data.attention || {},
    patternMemory: data.patternMemory || {},
    reading: data.reading || {},

    letterReversalCount: data.letterReversalCount,
    ageStartedReading: data.ageStartedReading,
    familyHistoryOfDyslexia: data.familyHistoryOfDyslexia,

    // Manual label if provided. Prediction will override only when manual is null/undefined.
    diagnosedDyslexic: data.diagnosedDyslexic ?? null,
    diagnosedByModel: null
  };
}

router.post("/submit-english-speaker-test", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    // Minimal validation
    if (typeof data.age !== "number") {
      return res.status(400).json({ success: false, message: "age is required and must be a number" });
    }

    // Resolve student and guardian
    let studentId;
    let guardianId = null;

    if (req.user.role === "guardian") {
      if (!data.student) {
        return res.status(400).json({ success: false, message: "student is required for guardian submissions" });
      }
      studentId = data.student;
      guardianId = req.user.id;
    } else {
      studentId = req.user.id;
    }

    // Build document from request
    const doc = new EnglishTestResult(buildDocFromRequest(data, studentId, guardianId));

    // Predict only if manual label is not provided
    let usedModel = false;
    if (data.diagnosedDyslexic === undefined || data.diagnosedDyslexic === null) {
      const features = toPredictionPayloadFromDoc(doc);
      const raw = await modelPrediction(features); // expected 0/1 or boolean
      const pred = typeof raw === "number" ? raw === 1 : Boolean(raw);

      doc.diagnosedByModel = pred;
      doc.diagnosedDyslexic = pred;
      usedModel = true;
    }

    await doc.save();

    // Store prediction with user profile as quick lookup (latest model prediction only)
    if (usedModel) {
      await User.findByIdAndUpdate(studentId, {
        isDyslexicPredicted: doc.diagnosedByModel,
        lastPredictionDate: new Date()
      });
    }

    return res.status(201).json({
      success: true,
      message: "English test result saved",
      result: doc
    });
  } catch (err) {
    console.error("Error in /submit-english-speaker-test:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
});

module.exports = router;
