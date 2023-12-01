const express = require("express")
const { createReport, uploadWritingFile, getReportByExamId, updateReport } 
= require("../controller/reportController")
const route = express.Router()



route.post("/add", createReport)
route.post("/upload", uploadWritingFile)
route.post("/", getReportByExamId)
route.post("/update", updateReport)

module.exports = route