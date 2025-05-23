const mongoose = reqiure("mongoose")
const writingSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    handwriting_clarity: Number, // Example: A score out of 10
    spelling_accuracy: Number, // Number of correct spellings
    grammar_mistakes: Number,
    punctuation_errors: Number,
    createdAt: { type: Date, default: Date.now }
  });
  
  const WritingProgress = mongoose.model("WritingProgress", writingSchema);
  module.exports = WritingProgress;