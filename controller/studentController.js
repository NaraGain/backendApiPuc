const students = require('../model/student')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const group = require("../model/group")

const getStudent = async (req,res)=>{
    try {
        const student = await students.find({})

        if(!student){
            return res.status(400).json({
                message : "No user found!"
            })
        }

        if(student.length == 0){
            return res.status(400).json({
                message : "No record is found"
            })
        }

        res.status(200).json({
            data : student,
        })



    } catch (error) {
        
    }
}


const getStudentById = async (req,res)=>{
    try {
        const findStudent = await students.find({_id : req.body.id})
        if(!findStudent){
            return res.status(400).json({
                message : "No record is found"
            })
        }

        res.status(200).json({
            data : findStudent,
        })


    } catch (error) {
        res.status(500).json({
            message: "error server could not response",
            error : error
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
                    message: "create user successfully "
                    });
        }
        next()

    } catch (error) {
        res.status(500).json({
            message: "error server could not response",
            error : error
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


module.exports = {getStudent , createStudent , loginStudent, getStudentById}