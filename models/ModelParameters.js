const mongoose = require('mongoose');

const EnglishTestResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Student' if you're using a separate Student model
    required: true
  },
  guardian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  age: {
    type: Number,
    required: true
  },

  // Core cognitive tasks (already in non-English model)
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

  // English-specific language features
  readingFluency: Number, // words per minute
  readingComprehensionScore: Number, // percentage or out of 10
  spellingAccuracy: Number, // percentage
  sightWordRecognitionScore: Number, // out of N
  phonemeDeletionScore: Number, // out of N
  rhymingScore: Number, // out of N
  syllableSegmentationScore: Number, // out of N
  nonWordReadingScore: Number, // out of N

  // Error patterns
  letterReversalCount: Number,

  // Behavioral/metadata
  ageStartedReading: Number,
  familyHistoryOfDyslexia: Boolean,

  // Diagnosis
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
