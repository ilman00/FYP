require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const mongoose = require("./config/db");
const dashboardRoutes = require("./routes/dashboard");
const creatingStudent = require("./routes/creatingStudents")
const TestData = require("./routes/TestRoute");
const adminDashboard = require("./routes/adminDahsboardRoute");
const adminTestResults = require("./routes/adminTestResults")
const childTestResult = require("./routes/childTestRoute")
const studentData = require("./routes/studentData")
const allStudents = require("./routes/guardianRoute")
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
app.use(creatingStudent)
app.use(TestData)
app.use(adminDashboard)
app.use(adminTestResults)
app.use(studentData)
app.use(childTestResult)
app.use(allStudents)
// Global Error Handler (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0',() => console.log(`Server running on port ${PORT}`));
