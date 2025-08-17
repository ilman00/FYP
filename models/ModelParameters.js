const mongoose = require('mongoose');

const EnglishTestResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Student' if using separate model
    required: true
  },
  guardian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  age: {
    type: Number,
    required: true
  },
  phonemeMatching: {
    score: Number,
    time: Number,
    errorsCount: Number
  },
  letterRecognition: {
    score: Number,
    time: Number,
    errorsCount: Number
  },
  attention: {
    score: Number,
    time: Number,
    errorsCount: Number
  },
  patternMemory: {
    score: Number,
    time: Number,
    errorsCount: Number
  },
  reading: {
    pronunciationAccuracy: Number, // %
    readingSpeedWpm: Number,       // words per minute
    timeTaken: Number,             // seconds
    totalErrors: Number,
    wrongWords: Number,
    totalScore: Number,            // out of N
    readingFluency: Number         // score out of N
  },
  letterReversalCount: Number,
  ageStartedReading: Number,
  familyHistoryOfDyslexia: Boolean,
  diagnosedByModel: {
    type: Boolean,
    default: null // null = not yet predicted
  },
  diagnosedDyslexic: {
    type: Boolean,
    default: null // manual label from admin/guardian
  },

  testDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EnglishTestResult', EnglishTestResultSchema);
