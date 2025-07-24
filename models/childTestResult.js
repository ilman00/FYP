const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  score: Number,
  time: Number,
  errorsCount: Number
}, { _id: false });

const childTestResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guardian: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: Number,
  tasks: {
    phonemeMatching: taskSchema,
    letterRecognition: taskSchema,
    attention: taskSchema,
    patternMemory: taskSchema
  },
  diagnosedDyslexic: { type: Boolean, required: true },
  diagnosedByModel: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChildTestResult', childTestResultSchema);
