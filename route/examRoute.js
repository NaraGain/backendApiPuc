const express = require('express')
const { getExam, createExam, deleteExam, findExamById, finedQuestionById, testPost } = require('../controller/examController')
const { auth } = require('../middleware/auth')
const route = express.Router()




route.get("/",auth, getExam)
route.get("/:id", auth, findExamById)
route.get("/question/:id", auth, finedQuestionById)
route.post("/create/", auth, createExam)
route.delete('/delete/:id/:course', auth, deleteExam)


module.exports = route