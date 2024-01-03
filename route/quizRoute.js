const express = require('express')
const { getQuiz, findQuizById, createQuiz, deleteQuiz,
     quizQueryByExamId, 
     updateQuiz} = require('../controller/quizController')
const route = express.Router()
const {auth} = require('../middleware/auth')


route.get("/",auth, getQuiz)
route.get("/:id",auth, findQuizById)
route.post("/create/:id", createQuiz)
route.post('/',auth, quizQueryByExamId)
route.patch('/update/:id',auth, updateQuiz)
route.delete('/delete/:id/:eid',auth, deleteQuiz)



module.exports = route