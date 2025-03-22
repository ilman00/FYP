const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  reading_speed: { type: Number, required: true }, // Words per minute
  spelling_errors: { type: Number, required: true },
  letter_reversals: { type: Number, required: true },
  word_omissions: { type: Number, required: true },
  reading_comprehension_score: { type: Number, required: true },
  parent_history_dyslexia: { type: Boolean, required: true },
  eye_tracking_data: { type: [Number], required: false }, // Optional eye-tracking data
  createdAt: { type: Date, default: Date.now },
});

const Student = mongoose.model("Student", studentSchema);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "teacher"], default: "user" },
  students: { type: [studentSchema], default: [] }, // Only applicable if role is "teacher"
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method


module.exports = User;
