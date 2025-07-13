const express = require("express")
const { User } = require("../models/User")

const router = express.Router()

router.get('/api/admin/stats', async (req, res) => {
  const totalUsers = await User.countDocuments()
  const totalStudents = await User.countDocuments({ role: 'student' })
  const totalGuardians = await User.countDocuments({ role: 'guardian' })

  res.json({
    totalUsers,
    totalReports: totalStudents,
    totalGuardians,
    totalModels: 1,
    accuracy: 87.5,
  })
})

router.get("/api/admin/users", async (req, res) => {
  const users = await User.find().select("-password")
  res.json(users)
})

module.exports = router
