const express = require("express");
const passport = require("passport");
const router = express.Router();

// Protected Route (Only authenticated users can access)
router.get("/dashboard", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ message: "Welcome to your dashboard!", user: req.user });
});

module.exports = router;
