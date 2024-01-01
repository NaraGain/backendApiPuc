const express = require("express")
const { createReport, uploadWritingFile, getReportByExamId, 
    updateReport, findReportOneById } 
= require("../controller/reportController")
const { auth } = require("../middleware/auth")
const route = express.Router()




route.post("/add", createReport)
route.post("/upload", uploadWritingFile)
route.post("/",auth, getReportByExamId)
route.post("/update",auth, updateReport)
route.get('/:id',auth, findReportOneById )

module.exports = route