const students = require('../model/student')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const group = require("../model/group")
const quizs = require("../model/quiz")
const exam = require('../model/exam')



const getStudent = async (req,res)=>{
    try {
        const student = await students.find({})

        if(!student){
            return res.status(400).json({
                message : "No user found!",
                success : false,
            })
        }

        if(student.length == 0){
            return res.status(400).json({
                message : "No record is found",
                success : false,
            })
        }

        res.status(200).json({
            data : student,
            success : true
        })



    } catch (error) {
        res.status(500).json({
            message: "error server could not response",
            error : error,
            success : false,
    })
    }
}


const getStudentById = async (req,res)=>{
    try {
        const findStudent = await students.findOne({_id : req.params.stuid})
        if(!findStudent){
            return res.status(400).json({
                message : "No record is found",
                success : false,
            })
        }

        res.status(200).json({
            message : "record found",
            success : true,
            result : findStudent,
        })


    } catch (error) {
        res.status(500).json({
            message: "error server could not response",
            error : error,
            success : false,
    })
    }
}

const queryQuestion = async (req,res)=> {
    try {
        const studentExam = await quizs.find({ExamId : req.body.examId})
        .populate('question')
        if(!studentExam){
            return res.status(401).json({
                message : "record not found",
                success : false,
            })
        }
        //question before response to cleint
        const stortSectionByTitle 
        = studentExam.sort((a,b)=>{
            const titleA = a.title.toLowerCase()
            const titleB = b.title.toLowerCase()
            if(titleA < titleB){
                return -1
            }else if (titleA > titleB){
                return 1
            }else{
                return 0
            }
        })

        //create random question and option to user //
        res.status(200).json({
            message : "fetched data",
            success : true,
            result : stortSectionByTitle
        })

    } catch (error) {
          res.status(500).json({
            message: "error server could not response",
            error : error,
            success : false,
    })
    }
}

const createStudent = async(req,res,next)=>{
    try {
        let student = new students(req.body)
        const findStudent = await students.findOne({username : req.body.username})
        if(findStudent){
            return res.status(500).json({
                message : 'username already exist',
                success : false
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashStudentPassword = await bcrypt.hash(req.body.password, salt)
        student.password = hashStudentPassword

        const Student = await student.save()
        const course = req.body.courseName
        const groups = await group.findOne({group : course})
        student.course.push(groups._id)
        groups.student.push(Student._id)

        saveTopGroup = await groups.save()
        const saveToStudent = await Student.save()
      
        if(saveToStudent){
            res.status(200).json(
                {
                    message: "create user successfully ",
                    success : true,
                    });
        }
        next()

    } catch (error) {
        res.status(500).json({
            message: "error server could not response",
            error : error,
            success : false,
    })
    }
}


const loginStudent = async (req,res , next) =>{
    try {
        
        
        const studentName = await 
        students.findOne({username : req.body.username})

        if(!studentName){
            return res.status(500).json({
                message : 'student name is not exist',
                success : false,
            })
        }

        const vailPassword = await bcrypt.compare(
            req.body.password,
            studentName.password,
        )

        if(!vailPassword){
            return res.status(400).json({
                message : "invaild student credentails",
                success : false,
            })
        }

        const token = jwt.sign({
            studentId : studentName._id,
            username : studentName.username
        } , process.env.accessToken , {
            expiresIn : '24h'
        })
        
        res.status(200).json({
            message : 'student is login successfully',
            success : true,
            id :  studentName?._id,
            name : studentName?.username,
            courseName : studentName?.courseName, 
            token : token,
        })

        next()
        
    } catch (error) {
        res.status(500).json({
            message: "error server could not response",
            error : error
    })
    }
}


// const studentQueryGroupExam = async () =>{
//     try {
//         const
//         const studentExam = await exam.findOne({startDate})
//     } catch (error) {
        
//     }
// }

const updateStudent = async (req,res,next)=>{
        try {
          const updatestudent = await 
            students.findByIdAndUpdate({_id : req.params.id}, req.body, {new :true})

            if(!updatestudent){
                return res.status(400).json({
                    message : 'unable to update student',
                    success : false
                })  
            }

            res.status(200).json({
                message : "update successufully",
                success : true 
             }) 

        } catch (error) {
            res.status(502).json({
                message: "error server could not response",
                success : false,
            })
        }
}

const resetPasswordStudent = async (req,res)=>{
       try {
        
        const {id} = req.params
        const token = req.headers["authorization"].split(' ')[1]
        const studentPassword = await students.findOne({_id : id})
        const newpassword = req.body.password

        if(!studentPassword){
            return  res.status(400).json({
                message : "user does not exist",
                success : false,
            })
        }

        const verify = jwt.verify(token , process.env.accessToken)
        if(!verify){
            return res.status(500).json({
                message: "token not match a request",
                success: false
            })
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashNewPassword = await bcrypt.hash(newpassword, salt)
        const studentNewPassword = await students.findByIdAndUpdate(
            {_id : id},
            {password : hashNewPassword},
            {new :true})
        studentNewPassword.save()
       if(!studentNewPassword){
        return  res.status(400).json({
            message : "could not reset new password ",
            success : false
        })
       }     
       res.status(200).json({
        message : "password have been reset please logout to validate",
        success : true,
    })

       } catch(error) {
        res.status(500).json({
            message: "error server could not response"
    })
       } 
}

const removeStudent = async (req,res) => {
    try {

        const findGroup = await group.findOne({group : req.body.courseName})
        if(findGroup){
            await findGroup.student.remove(req.body.stuId)
            await findGroup.save()
        }
        const removeStudent = await 
        students.findByIdAndDelete({_id : req.body.stuId})
        if(!removeStudent){
            return res.status(400).json({
                message  : "could not remove student",
                success : false,
            })
        }

        res.status(200).json({
            message : "remove successfully",
            success : true,
            result  : removeStudent,
        })
    } catch (error) {
        
    }
}




module.exports =
 {getStudent , createStudent ,
 loginStudent, getStudentById ,
  queryQuestion ,removeStudent , updateStudent ,resetPasswordStudent}