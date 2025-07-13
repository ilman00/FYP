// routes/adminTestResults.js

const express = require('express')
const TestResult = require('../models/ModelParameters') // over7
const ChildTestResult = require('../models/childTestResult') // non-English

const router = express.Router()

router.get('/api/admin/test-results', async (req, res) => {
  try {
    const over7 = await TestResult.find()
      .populate('student guardian', 'name email')
      .lean()

    const nonEnglish = await ChildTestResult.find()
      .populate('student guardian', 'name email')
      .lean()

    // Normalize and combine data
    const combined = [
      ...over7.map(result => ({
        id: result._id,
        studentName: result.student?.name || 'Unknown',
        guardianName: result.guardian?.name || 'Unknown',
        modelType: 'over7',
        diagnosedDyslexic: result.diagnosedDyslexic,
        tasks: {
          reading: result.reading,
          writing: result.writing,
          letterReversal: result.letterReversal,
          attentionSpan: result.attentionSpan
        },
        testDate: result.testDate
      })),
      ...nonEnglish.map(result => ({
        id: result._id,
        studentName: result.student?.name || 'Unknown',
        guardianName: result.guardian?.name || 'Unknown',
        modelType: 'nonEnglish',
        diagnosedDyslexic: result.diagnosedDyslexic,
        tasks: result.tasks,
        testDate: result.createdAt
      }))
    ]

    res.json(combined)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load test results' })
  }
})

module.exports = router
