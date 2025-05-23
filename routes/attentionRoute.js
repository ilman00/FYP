// Assuming you're using Express and Mongoose

const express = require('express');
const router = express.Router();
const Attention = require('../models/attentionModel'); // your Mongoose model

// POST /api/attention
router.post('/attention', async (req, res) => {
  try {
    const {
      userId,
      sessionId,
      timestamp,
      activityType,
      activityDuration,
      activeTime,
      idleTime,
      distractionEvents,
      avgTouchInterval,
      reactionTimes,
      accuracyScore,
      attentionScore,
    } = req.body;

    const newAttentionRecord = new Attention({
      userId,
      sessionId,
      timestamp,
      activityType,
      activityDuration,
      activeTime,
      idleTime,
      distractionEvents,
      avgTouchInterval,
      reactionTimes,
      accuracyScore,
      attentionScore,
    });

    await newAttentionRecord.save();

    res.status(201).json({ message: 'Attention data saved successfully.' });
  } catch (error) {
    console.error('Error saving attention data:', error);
    res.status(500).json({ error: 'Failed to save attention data.' });
  }
});

module.exports = router;
