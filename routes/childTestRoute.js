const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // assumes JWT or session auth
const ChildTestResult = require('../models/childTestResult'); // your MongoDB model
const predictChildTest = require('../ml/predictChildTest'); // function to call Python model

router.post('/submit-child-test', authMiddleware, async (req, res) => {
  try {
    const { studentId, age, tasks, diagnosedDyslexic } = req.body;

    // ✅ Basic field validation
    console.log(studentId, age, tasks, diagnosedDyslexic);
    if (!studentId || !age || !tasks || typeof tasks !== 'object') {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Missing or invalid fields: studentId, age, or tasks'
      });
    }

    const requiredTasks = ['phonemeMatching', 'letterRecognition', 'attention', 'patternMemory'];

    // ✅ Check each task has score, time, errors
    for (const taskName of requiredTasks) {
      const task = tasks[taskName];
      if (!task || typeof task.score !== 'number' || typeof task.time !== 'number' || typeof task.errors !== 'number') {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `Missing or invalid fields in task: ${taskName}`
        });
      }
    }

    let finalDiagnosis = diagnosedDyslexic;

    // ✅ If guardian did not label, send to Python AI model
    if (finalDiagnosis === undefined || finalDiagnosis === null) {
      try {
        finalDiagnosis = await predictChildTest({

          age,
          ...tasks
        });
      } catch (err) {
        console.error('Prediction model error:', err);
        return res.status(500).json({
          status: 500,
          success: false,
          message: 'Failed to get prediction from AI model'
        });
      }
    }

    // ✅ Create new test record
    const newTest = new ChildTestResult({
      student: studentId,
      guardian: req.user.id,
      age,
      tasks,
      diagnosedDyslexic: finalDiagnosis,
      diagnosedByModel: diagnosedDyslexic === null || diagnosedDyslexic === undefined
    });

    await newTest.save();

    return res.status(201).json({
      status: 201,
      success: true,
      message: 'Child test submitted successfully',
      data: newTest
    });

  } catch (err) {
    console.error('Error saving child test:', err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
