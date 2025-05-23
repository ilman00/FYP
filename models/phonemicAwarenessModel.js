const mongoose = require("mongoose");

const phonemicResponseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activityType: { type: String, enum: ["identification", "blending", "segmentation"], required: true },
  questionId: { type: String, required: true }, // ID from frontend question bank
  userResponse: { type: String, required: true }, // Selected option
  isCorrect: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PhonemicResponse", phonemicResponseSchema);
