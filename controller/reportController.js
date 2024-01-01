const exams = require("../model/exam")
const reports = require("../model/report")
const fs = require('fs').promises
const path = require('path')
const students = require("../model/student")
const files =  require('../model/file')

const createReport = async (req,res) => {
    try {
        const report =  new reports(req.body)
        // const code = userId.user + examId.exam
        const saveToReport = await report.save()

        if(!saveToReport){
          return  res.status(404).json({
                message : `could't add to report`,
                success : false,
            })
        }
        
        res.status(200).json({
            message : `report have submit`,
            success : true,
        })
       

    } catch (error) {
        res.status(502).json({
            message: "error server could not response",
            error : error,
            success: false,
          })
    }
}

//update file for wiriting section
const uploadWritingFile = async (req,res) => {
    try {
            const file = req.files.file
            let fileName = file?.md5 + file?.name
            const uploadPath = path.join(__dirname , "../public/exam/" + `${fileName}`)

           const Files = new files({
            path :{
                url : `/${fileName}`,
                type : `${file.mimetype}`
            }, name : "exam"}) 

            await file.mv(uploadPath)
            const saveToFile = await Files.save()
            if(!saveToFile){
                return res.status(401).json({
                    message : 'could not upload file',
                    success: false,
                })
            }
            res.status(200).json({
                message : "upload true",
                path : `/${fileName}`,
                success : true
            })
    } catch (error) {
        res.status(401).json({
            message : "error server could not response",
        })
    }
}


const getReportByExamId = async(req , res)=>{
   try {
    let reportFind = ""
    const userSummaries = [];
    if(req.body.examId){
        reportFind = await reports
        .find({exam: {$in : req.body.examId}})
        .populate('user')
        .populate('exam')
        const results = {
            isHuman : false,
        }
        const findResult = reportFind.map(result => result.result)
        const findStudent = reportFind.map(student => student.user)
        // Iterate through each user and their respective exam results
        for (let i = 0; i < findStudent.length; i++) {
          const user = findStudent[i];
          const results = findResult[i];
          // Create a summary object for the user
          const summaryObject = {
            _id: user._id,
            username: user.username,
          };    
          // Initialize total marks for the user
          let totalMarks = 0;
          // Iterate through the user's exam results
          for (let j = 0; j < results.length; j++) {
            const { markPoint, subjectName, status } = results[j];
            // Add subject marks to the summary object
            summaryObject[subjectName] = markPoint == undefined ? 0 : markPoint;
            totalMarks += parseInt(markPoint);
          }
          // Add total marks and status to the summary object
          summaryObject.total = totalMarks ? totalMarks : 0;
          summaryObject.status = 'failed'; // Assuming status is 'failed' for the sake of example 
          // Push the summary object to the userSummaries array
          userSummaries.push(summaryObject);
        }
       //stor the result       
        const sortkeys = Object.keys(results).sort()
        sortkeys.forEach(key => {
            results[key] = results[key]
        })

    }else{
        reportFind = await reports
        .find({user : req.body.userId})
       

    }
   
    if(!reportFind){
        return res.status(400).json({
            message : "not report found",
            success : false,
        })

    }

   res.status(200).json({
        message : "report found",
        result : req.body.examId ? userSummaries : reportFind,
        success : true,
    })  
    
   } catch (error) {
        res.status(401).json({
            message : "error server could not response",
        })
   }
}


const findReportOneById = async (req,res)=>{
    try {
        const report = await reports.findOne({_id : req.params.id})
        if(!report){
          return  res.status(404).json({
                message : `could't find report`,
                success : false,
            })
        }


        res.status(200).json({
            message : 'report found',
            success : true,
            result : report,
        })
    } catch (error) {
        res.status(502).json({
            message: "error server could not response"
          })
    }
}

const getAllReport  = async (req,res)=>{
    try {
        const {examName , userName} = req.body
        const Exam = await exams.findOne({
            
        })
    } catch (error) {
        res.status(401).json({
            message : "error server could not response",
        })
    }
}

const updateReport = async (req,res) => {
    try {
        
        const findResult = await reports.findOne({user : req.body.stuId})
        const get = findResult.result.findIndex(object => object.subjectName == req.body.name)
        let updateReport = ''
        
        if(get !== -1){
          findResult.result[get].markPoint = req.body.markPoint
            let status = ""
            if(req.body.markPoint < 12.5){
                status = "failed"
            }else {
                status = "pass"
            }
            findResult.result[get].status  = status
            const findReport = await reports.findOne({_id : req.body.rid})
            findReport.result = findResult.result
            updateReport = await findReport.save()
            if(updateReport){
                return res.status(200).json({
                    message : "update success",
                    success : true,
                })
            }
        }
        
        res.status(401).json({
            message : "miss update",
            success : false,
        }) 

    } catch (error) {
        res.status(401).json({
            message : "error server could not response",
        })
    }
}


module.exports = {createReport , uploadWritingFile , getReportByExamId , updateReport ,findReportOneById}