require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const mongoose = require("./config/db");
const dashboardRoutes = require("./routes/dashboard");
const readingScore = require("./routes/readingScoreRoute")
const creatingStudent = require("./routes/creatingStudents")

// Connect to MongoDB

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS
app.use(passport.initialize());

// Passport Config
require("./config/passport");

// Register Routes
app.use(authRoutes);
app.use(dashboardRoutes);
app.use("/api",readingScore);
app.use(creatingStudent)

// Global Error Handler (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
