const express = require("express")
const router = express.Router()
const isAuthenticated = require('../middlewares/authMiddleware')
const {User} = require('../models/User')

router.get("/superviser", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (user.role !== "Superviser") {
        return res.status(401).json({ message: "You must have a role of Superviser" });
      }
  
      // Assuming req.user does not contain full user document (e.g., populated via session)
      const students = await Student.find({ superviserId: req.user._id });

  
      res.status(200).json({students: students });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong!" });
    }
  });
  