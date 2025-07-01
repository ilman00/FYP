const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const TestResult = require('../models/TestResult');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/students/:id/test-results', authMiddleware, async (req, res) => {
  try {
    const studentId = req.params.id;
    const guardianId = req.user._id;

    // Step 1: Validate student ownership
    const student = await Student.findOne({ _id: studentId, guardian: guardianId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or does not belong to this guardian'
      });
    }

    // Step 2: Fetch test results for this student
    const testResults = await TestResult.find({ student: studentId });

    res.json({
      success: true,
      student,
      testResults
    });

  } catch (err) {
    console.error('Error fetching student results:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
