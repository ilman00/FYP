const express = require("express")
const ModelParameter = require("../models/ModelParameters")
const authMiddelware = require("../middlewares/authMiddleware")
const modelPrediction = require("../ml/modelPrediction")

const router = express.Router()

router.post("/submit-english-speaker-test", authMiddelware, async (req, res) => {
  try {
    const data = req.body;
    let prediction;

    // Prepare payload only if no manual label is provided
    if (data.diagnosedDyslexic === undefined || data.diagnosedDyslexic === null) {
      const predictionPayload = {
        age: data.age,
        phonemeMatching_score: data.phonemeMatching?.score,
        phonemeMatching_time: data.phonemeMatching?.time,
        phonemeMatching_errorsCount: data.phonemeMatching?.errors,

        letterRecognition_score: data.letterRecognition?.score,
        letterRecognition_time: data.letterRecognition?.time,
        letterRecognition_errorsCount: data.letterRecognition?.errors,

        attention_score: data.attention?.score,
        attention_time: data.attention?.time,
        attention_errorsCount: data.attention?.errors,

        patternMemory_score: data.patternMemory?.score,
        patternMemory_time: data.patternMemory?.time,
        patternMemory_errorsCount: data.patternMemory?.errors,

        readingFluency: data.readingFluency,
        readingComprehensionScore: data.readingComprehensionScore,
        spellingAccuracy: data.spellingAccuracy,
        sightWordRecognitionScore: data.sightWordRecognitionScore,
        phonemeDeletionScore: data.phonemeDeletionScore,
        rhymingScore: data.rhymingScore,
        syllableSegmentationScore: data.syllableSegmentationScore,
        nonWordReadingScore: data.nonWordReadingScore,

        letterReversalCount: data.letterReversalCount,
        ageStartedReading: data.ageStartedReading,
        familyHistoryOfDyslexia: data.familyHistoryOfDyslexia
      };

      prediction = await modelPrediction(predictionPayload);
      data.diagnosedByModel = prediction; // model’s 0/1 prediction
    }

    // Determine student/guardian IDs based on role
    let studentId, guardianId;

    if (req.user.role === "guardian") {
      // Guardian is submitting test for a student (student ID comes from request)
      studentId = data.student;
      guardianId = req.user.id;
    } else {
      // Regular user is taking their own test
      studentId = req.user.id;
      guardianId = null;
    }

    const result = new ModelParameter({
      student: studentId,
      guardian: guardianId,
      age: data.age,

      phonemeMatching: {
        score: data.phonemeMatching?.score,
        time: data.phonemeMatching?.time,
        errors: data.phonemeMatching?.errors
      },
      letterRecognition: {
        score: data.letterRecognition?.score,
        time: data.letterRecognition?.time,
        errors: data.letterRecognition?.errors
      },
      attention: {
        score: data.attention?.score,
        time: data.attention?.time,
        errors: data.attention?.errors
      },
      patternMemory: {
        score: data.patternMemory?.score,
        time: data.patternMemory?.time,
        errors: data.patternMemory?.errors
      },

      readingFluency: data.readingFluency,
      readingComprehensionScore: data.readingComprehensionScore,
      spellingAccuracy: data.spellingAccuracy,
      sightWordRecognitionScore: data.sightWordRecognitionScore,
      phonemeDeletionScore: data.phonemeDeletionScore,
      rhymingScore: data.rhymingScore,
      syllableSegmentationScore: data.syllableSegmentationScore,
      nonWordReadingScore: data.nonWordReadingScore,

      letterReversalCount: data.letterReversalCount,
      ageStartedReading: data.ageStartedReading,
      familyHistoryOfDyslexia: data.familyHistoryOfDyslexia,

      diagnosedDyslexic: data.diagnosedDyslexic ?? prediction,
      diagnosedByModel: data.diagnosedByModel ?? null
    });

    await result.save();

    res.status(201).json({
      success: true,
      message: 'English test result saved',
      result
    });

  } catch (err) {
    console.error('Error in English test API:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
});


module.exports = router