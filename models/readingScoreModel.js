const mongoose = require("mongoose");

const readingSchema = new mongoose.Schema({
    superViserId: {type:mogoose.Schema.Types.ObjectId, ref: "User"},
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    readingScore: Number,
    readingErrors: Number,
    readingTime: Number,
    createdAt: { type: Date, default: Date.now }
  });
  
  const ReadingProgress = mongoose.model("ReadingProgress", readingSchema);
  module.exports = ReadingProgress;
  