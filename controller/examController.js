
const exam = require("../model/exam");
const group = require("../model/group");
const questions = require("../model/question")
const {io} = require('../index.js')
const startCountdown = require("../External/timer");


var generateRandomNDigits = (n) => {
    return Math.floor(Math.random() * (9 * (Math.pow(10, n)))) + (Math.pow(10, n));
  }

const getExam = async (req,res)=>{
    
    try {

        const exams = await exam.find({})

        if(!exams){
            return res.status(404).json({
                message : "not found exam",
                success : false,
            })
        }

        if (exams.length < 1){

            return res.status(404).json({
                message : "No record found",
                success : false,
            })
        }
      
        res.status(200).json({
                result : exams,
                message : "record found",
                success : true
            })
        
    } catch (error) {
        res.status(502).json({
            message : "error Internal server could not response.",
            success : false,
        })
    }

}

const findExamById = async (req,res)=>{
try {
    const {id : e_id} = req.params

    const exams = await exam.findById({_id : e_id}).populate('quiz')

    if(!exams){
        return res.status(404).json({
            message : "Exam is not found"
        })
    }

    res.status(200).json({
        message : "exam found",
        success : true,
        result:exams
    })
    
} catch (error) {
    res.status(502).json({
        message : "error Internal server could not response."
    })
}

}

const startExam = async (req,res)=> {
    try { 
             startCountdown(req.body.minutes,
              req.body.seconds)
              res.status(200).json({
                message : "exam start",
                success : true,
              })  

    } catch (error) {
        res.status(400).json({
            message : "error internal server could not response",
            success : false,
            errors : error ,
          })
    }
}


const finedQuestionById = async (req,res)=>{
   try {
        const {id : e_id} = req.params
    
        const exams = await exam.findById({_id : e_id}).populate('quiz')
        const returnQuestion = exams.quiz
        const getQuestion = returnQuestion.map((i)=> {return i})
        if(!exams){
            return res.status(404).json({
                message : "Exam is not found"
            })
        }
    
        res.status(200).json({
             getQuestion
        })
        
    } catch (error) {
        res.status(502).json({
            message : "error Internal server could not response."
        })
    }

}


const createExam = async (req,res,next)=>{

    const keys = generateRandomNDigits(5)
    try { 

        const exams = new exam(req.body)  
        
         const Exam = await exams.save()

         const groups = await group.findOne({group: req.body.course})
         groups.exam.push(Exam._id)

        if(groups.exam.length > 10){
            return res.status(404).json({
                message : "You could not create more than 10",
                success:false
            })
        }else{
            const saveToGroup = await groups.save()
            if(saveToGroup){
                return res.status(200).json({
                    message : "create sucessfully exam",
                    e_id: Exam._id ,
                    success : true
                })
               }
       }
           	next()

    } catch (error) {
        res.status(502).json({
            message: "error server could not response",
            error_case : new Error(),
            success: false
          })
        
    }
}


const updateExam = async (req,res)=>{
    try {
        const exams = await exam.
        findByIdAndUpdate({_id :req.params.id}, req.body ,{new:true})
        if(!exams){
            return res.status(400).json({
                message : 'could not update user something was wrong.',
                success : false,
            })
        }

        res.status(200).json({
            message : 'quiz update successfully',
            data : exams,
            success:true,
        })

    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
}

const assignSectionToExam = async (req,res) => {
    try {
        const findExam = await exam.findOne({name : req.body.exam_name})
        
        if(!findExam){
            return res.status(401).json({
                message : 'exam are not exist',
                success : false,
            })
        }

        await findExam.quiz.push(req.body.quiz_id) 
        const saveToExam = await findExam.save()

        if(!saveToExam){
            return res.status(401).json({
                message : 'could not clone section',
                success : false,
            })
        }  
        //add new id to new group
        res.status(200).json({
            message : 'successfully to clone section',
            success : true,
        })

    } catch (error) {
        res.status(502).json({
            message: "error server could not response",
            success : false,
        })
    }
}

const deleteExam = async (req,res)=>{
    try {

        const {id : e_id , course : course} = req.params
        const groups = await group.findOne({group: course})    
        const exams = await exam.findOne({_id : e_id})
        let deleteExam = ''
        if(exams.quiz.length !== 0 ){  
            //return response it not working now i wiil try to fix later   
            return res.status(400).json({
                message : "could not delete exam please in delete quiz first",
                success : false
            })
        }else{
          const removeExamFormGroup =  groups.exam.remove(e_id)     
          if(removeExamFormGroup){
            await groups.save()  
            deleteExam = await exam.findByIdAndDelete({_id: e_id}) 
          }

          if(!deleteExam){
            return res.status(400).json({
                message : "could not delete exam",
                success : false,
            })
          }
        }     
     
        res.status(200).json({
            message : "exam have been remove",
            success : true,
        })
          
    } catch (error) {
        res.status(502).json({
            message: "error server could not response",
            success : false,
        })
    }
}

const removeExamFormGroup = async (req,res)=>{
        try {
            const groups = await group.findOne({_id : req.body.groupId})
            if(!groups){
                return res.status(400).json({
                    message : "could not find course",
                    success : false,
                })
            }
            
            groups.exam.remove(req.body.examId)
            const saveToGroups = await groups.save()
            
            if(saveToGroups){
                res.status(200).json({
                    message : "exam have been remove",
                    success : true,
                })
            }

        } catch (error) {
            res.status(502).json({
                message: "error server could not response",
                success : false,
            }) 
        }
}



module.exports = {getExam ,
    findExamById, finedQuestionById, createExam ,startExam,
     deleteExam ,assignSectionToExam, updateExam , removeExamFormGroup}