const express = require('express');
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware");
const {Student} = require("../models/User");

router.post("/api/register-student", authMiddleware, async (req, res)=>{
    try {
        let user = req.user;
        if(user.role !== "Superviser"){
            return res.send({Error: "Only a Superviser can add a student"})
        }

        const newStudent = new Student({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            parent_history_dyslexia: req.body.parent_history_dyslexia,
            teacher_id: user._id
        })

        await newStudent.save()

        res.status(201).send({Success: "Student created successfully"})
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router;