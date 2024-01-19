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
            let fileName = file?.md5 + `studentexam`
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


const getReportByGroupAndStudent = async(req , res)=>{
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
            name: user?.firstname + " " + user?.lastname,
            gender : user?.gender,
          };    
          // Initialize total marks for the user
          let totalMarks = 0;
          // Iterate through the user's exam results
          for (let j = 0; j < results.length; j++) {
            const { markPoint, subjectName, status } = results[j];
            // Add subject marks to the summary object
            summaryObject[subjectName] = markPoint == undefined ? 0 : markPoint;
            totalMarks += parseFloat(markPoint);
          }
          // Add total marks and status to the summary object
          totalMarks = totalMarks ? totalMarks : 0
          summaryObject.total = parseFloat(totalMarks);
          let grade = '';
           if (parseFloat(totalMarks) >= 90.0){
            grade = 'A';
          }else if (parseFloat(totalMarks) >= 80.9){
            grade = 'B';
          }else if (parseFloat(totalMarks) >= 70.9){
            grade = 'C';
          }else if (parseFloat(totalMarks) >= 60.9){
            grade = 'D';
          }else if(parseFloat(totalMarks) >= 50.9){
            grade = 'E';
          }else{
            grade = 'F';
          }
          summaryObject.grade = grade;
          summaryObject.status = 'FAILED'; // Assuming status is 'failed' for the sake of example u
          // Push the summary object to the userSummaries array
          userSummaries.push(summaryObject);
        }
       //stor the result       
        const sortkeys = Object.keys(results).sort()
        sortkeys.forEach(key => {
            results[key] = results[key]
        })  

    }else{
        if(req.body.course){
            reportFind = await reports
            .find({course : req.body.course}).populate('exam')

            const items = reportFind.map((items,key)=> 
            ({
                _id : items?._id,
                user : items?.user,
                course : items?.course,
                exam_title : items?.exam?.name,
                exam_date : items?.exam?.date

            })
        )  
        reportFind = items
        }else{
            reportFind = await reports
            .find({user : req.body.userId}).populate('exam')
            
           const items = reportFind.map((items,key)=> 
                ({
                    _id : items?._id,
                    user : items?.user,
                    course : items?.course,
                    exam_title : items?.exam?.name,
                    exam_date : items?.exam?.date

                })
            )  
            reportFind = items
        }
        
        
    }
    if(!reportFind){
        return res.status(400).json({
            message : "not report found",
            success : false,
        })

    }

   res.status(200).json({
        message : "report found",
        success : true,
        result : req.body.examId ? userSummaries : reportFind,
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



const updateReport = async (req,res) => {
    try {
        //update by point to student_id and exam_id
        const findResult = await reports.findOne({user : req.body.stuId})
        const get = findResult.result.findIndex(object => object.subjectName == req.body.name)
        let updateReport = ''
        
        if(get !== -1){
          findResult.result[get].markPoint = req.body.markPoint
            let status = ""
            const sectionScore = req.body.sectionScore / 2
            //init req.body markPoint for upload 12.5
            if(parseFloat(req.body.markPoint) <= parseFloat(sectionScore)){
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

const deleteReport = async (req,res)=> {
    try {
        //delete report by report_id
        const report = await reports.findByIdAndDelete({_id : req.params.id})

        if(!report) {
            return res.status(401).json({
                message : "could not delete report.",
                success : false,
            })
        }

        res.status.json({
            message : "report delete sucessfully",
            success : true,
            result : report,
        })


    } catch (error) {
        res.status(401).json({
            message : "error server could not response",
            success : false,
        })
    }
}

module.exports = {
    createReport , uploadWritingFile , getReportByGroupAndStudent
    , updateReport ,findReportOneById , deleteReport}