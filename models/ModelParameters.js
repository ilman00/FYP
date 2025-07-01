const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  guardian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Reading Test
  reading: {
    time: Number,       // in seconds
    score: Number,
    errors: Number
  },

  // Writing Test
  writing: {
    score: Number
  },

  // Letter Reversal Test
  letterReversal: {
    count: Number
  },

  // Attention Span Test
  attentionSpan: {
    duration: Number,      // seconds
    distractions: Number
  },

  // Optional Dyslexia Label by Guardian
  diagnosedDyslexic: {
    type: Boolean, // true (yes), false (no), undefined (not specified)
    default: undefined
  },

  testDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TestResult', TestSchema);
