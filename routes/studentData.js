const express = require('express');
const router = express.Router();
const {Student} = require('../models/User');
const EnglishSpeaker = require('../models/ModelParameters');
const nonEnglishSpeaker = require("../models/childTestResult")
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/student/:id/test-results', authMiddleware, async (req, res) => {
  try {
    const studentId = req.params.id;
    const guardianId = req.user._id;

    // Step 1: Validate student ownership
    const student = await Student.findOne({ _id: studentId, guardian: guardianId });
    if (!student) {
      return res.status(404).json({
        status:400,
        success: false,
        message: 'Student not found or does not belong to this guardian'
      });
    }

    // Step 2: Fetch test results for this student
    let testResults = await EnglishSpeaker.find({ student: studentId });
    if(testResults.length === 0){
      testResults = await nonEnglishSpeaker.findOne({student: studentId})
    }

    res.json({
      status: 200,
      success: true,
      student,
      testResults
    });

  } catch (err) {
    console.error('Error fetching student results:', err);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
