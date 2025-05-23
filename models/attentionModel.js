const mongoose = require('mongoose');

const AttentionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  sessionId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  activityType: {
    type: String,
    enum: ['reading', 'writing', 'game', 'assessment', 'other'],
    required: true
  },
  activityDuration: {
    type: Number, // in seconds or milliseconds
    required: true
  },
  activeTime: {
    type: Number,
    required: true
  },
  idleTime: {
    type: Number,
    required: true
  },
  distractionEvents: {
    type: Number,
    default: 0
  },
  avgTouchInterval: {
    type: Number,
    default: 0
  },
  reactionTimes: {
    type: [Number], // Array of reaction times in ms
    default: []
  },
  accuracyScore: {
    type: Number, // Could be percentage (0-100)
    default: null
  },
  attentionScore: {
    type: Number, // Final score for attention (0-100)
    default: null
  }
});

module.exports = mongoose.model('Attention', AttentionSchema);
