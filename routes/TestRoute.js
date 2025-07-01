const express = require('express');
const router = express.Router();
const TestResult = require('../models/ModelParameters');
const authMiddleware = require('../middlewares/authMiddleware'); // gets req.user

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const {
      studentId,
      reading,
      writing,
      letterReversal,
      attentionSpan,
      diagnosedDyslexic // optional
    } = req.body;

    // ✅ Basic validation
    if (!studentId || !reading || !writing || !letterReversal || !attentionSpan) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentId, reading, writing, letterReversal, or attentionSpan'
      });
    }

    // ✅ Create a new TestResult document
    const newTest = new TestResult({
      student: studentId,
      guardian: req.user.id, // assuming req.user comes from auth middleware
      reading,
      writing,
      letterReversal,
      attentionSpan,
      diagnosedDyslexic // optional field
    });

    await newTest.save();

    return res.status(201).json({
      success: true,
      message: 'Test data submitted successfully',
      data: newTest
    });

  } catch (err) {
    console.error('Error saving test:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while saving test data'
    });
  }
});

module.exports = router;
