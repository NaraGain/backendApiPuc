const express = require("express")
const { createReport, uploadWritingFile, getReportByExamId, 
    updateReport, findReportOneById, deleteReport } 
= require("../controller/reportController")
const { auth, checkRole } = require("../middleware/auth")
const route = express.Router()




route.post("/add", createReport)
route.post("/upload", uploadWritingFile)
route.post("/",auth, getReportByExamId)
route.post("/update",auth, updateReport)
route.get('/:id',auth, findReportOneById )
route.delete('/delete/:id', auth , checkRole(['superadmin', 'admin']), deleteReport)

module.exports = route