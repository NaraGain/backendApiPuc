const express = require('express')
const { getQuestion, createQuestion, getQuestionByPage, testuploadfile, 
    deleteQuestion, getQuestionById } = require('../controller/questionController')
const route = express.Router()



route.get("/", getQuestion)
route.post ("/",getQuestionById)
route.post("/create/:id", createQuestion)
route.post("/test/:id", testuploadfile)
route.get("/page", getQuestionByPage)
route.post("/delete/:id/:subId", deleteQuestion)

module.exports = route