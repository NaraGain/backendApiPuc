const express = require('express')
const { getExam, createExam, deleteExam,
     findExamById, finedQuestionById,
    updateExam,
    removeExamFormGroup,
   assignSectionToExam} = require('../controller/examController')
const { auth, checkRole } = require('../middleware/auth')
const route = express.Router()




route.get("/",auth, getExam)
route.get("/:id", auth, findExamById)
route.get("/question/:id", auth, finedQuestionById)
route.post("/create", auth, checkRole(['superadmin', "admin"]), createExam)
route.patch('/update/:id', auth, updateExam)
route.delete('/delete/:id/:course', auth, deleteExam)
route.patch('/assign', auth, assignSectionToExam)
route.post('/removeexam', removeExamFormGroup)


module.exports = route