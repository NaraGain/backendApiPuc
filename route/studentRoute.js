const express = require('express')
const { getStudent, createStudent, loginStudent, getStudentById, 
    queryQuestion, updateStudent, resetPasswordStudent, removeStudent } 
= require('../controller/studentController')
const { auth, checkRole } = require('../middleware/auth')
const route = express.Router()


route.get("/",auth, getStudent)
route.post("/create",auth, createStudent)
route.post("/login", loginStudent)
route.get("/get/:stuid",auth, getStudentById)
route.post("/question", queryQuestion)
route.patch('/update/:id',auth ,updateStudent)
route.post('/delete' ,auth, removeStudent)
route.patch('/reset-password/:id' ,auth ,checkRole(["superadmin", 'admin', 'teacher']),
 resetPasswordStudent)
module.exports = route