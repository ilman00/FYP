const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});

console.log("🌍 MongoDB URL:", process.env.MONGO_URL);

module.exports = mongoose;

