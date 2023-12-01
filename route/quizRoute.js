const express = require('express')
const { getQuiz, findQuizById, createQuiz, deleteQuiz,
     quizQueryByExamId } = require('../controller/quizController')
const route = express.Router()



route.get("/", getQuiz)
route.get("/:id", findQuizById)
route.post("/create/:id", createQuiz)
route.post('/', quizQueryByExamId)
route.delete('/delete/:id/:eid', deleteQuiz)



module.exports = route