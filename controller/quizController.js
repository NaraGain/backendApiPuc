const quiz = require("../model/quiz")
const exam = require("../model/exam");
const group = require("../model/group");
const questions = require("../model/question")



var generateRandomNDigits = (n) => {
    return Math.floor(Math.random() * (9 * (Math.pow(10, n)))) + (Math.pow(10, n));
  }

const getQuiz = async (req,res)=>{
    
    try {

        const quizs = await quiz.find({})

        if(!quizs){
            return res.status(404).json({
                message : "not found quiz"
            })
        }
        if (quiz.length < 1){
            return res.status(404).json({
                message : "No record found"
            })
        }
        res.status(200).json({quizs})
        
    } catch (error) {
        res.status(502).json({
            message : "error Internal server could not response."
        })
    }

}


const quizQueryByExamId = async (req,res) =>{
 try {
     const queryQuiz = await quiz.find({ExamId : req.body.examId}).populate('question')

     if(!queryQuiz){
        return res.status(404).json({
            message : "not found quiz",
            success : false,
        })
     }
     res.status(200).json({
        message : "query quiz successfully",
        success : true,
        result :queryQuiz,
        })
        
 } catch (error) {
    
    res.status(500).json({
        message : "Internal Server Error",
        success : false
    })

 }


}


const findQuizById = async (req,res)=>{
try {
    const {id : sub_id} = req.params

    const quizs = await quiz.findById({_id : sub_id}).populate('question')

    if(!quizs){
        return res.status(404).json({
            message : "Exam is not found",
            success:falsem
        })
    }

    res.status(200).json({
         quizs
    })
    
} catch (error) {
    res.status(502).json({
        message : "error Internal server could not response.",
        success:false,
    })
}

}




const createQuiz = async (req,res,next)=>{
    try { 
        const quizs = new quiz(req.body)
        const {id:e_id} = req.params
        const Quiz = await quizs.save()

         const exams = await exam.findOne({_id: e_id})
         exams.quiz.push(Quiz._id)    
         const saveToExam = await exams.save()

         
           if(saveToExam){
            return res.status(200).json({
                message : "create sucessfully exam",
                e_id: Quiz._id ,
                quiz : quizs,
                success : true
            })
           }

           	next()

    } catch (error) {
        res.status(502).json({
            message: "error server could not response",
            error_case : new Error(),
            success:false,
          })
        
    }
}


const updateQuiz = async (req,res)=>{
    try {
        const exams = await quiz.
        findByIdAndUpdate({_id :req.params.id},req.body, {new:true})

        if(!exams){
            return res.status(400).json({
                message : 'could not update user something was wrong.',
                success : false,
            })
        }

        res.status(200).json({
            message : 'quiz update successfully',
            data : exams,
            success : true,
        })

    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
}

const deleteQuiz = async (req,res)=>{
    try {
        
        const {id : sub_id} = req.params
        const {eid : exam_id} = req.params
        const exams = await exam.findOne({_id : exam_id})
        const quizs = await quiz.findOne({_id : sub_id})
        

        if(quizs.question.length !== 0){
            return res.status(400).json({
                message : "quiz is not empty",
                success : false,
            })
        }else{
            const getSubjectName = exams.quiz.remove(sub_id)
            if(getSubjectName){
                await exams.save()
            }
            var deleteQuiz = await quiz.findByIdAndDelete({_id: sub_id})
            if(!deleteQuiz){
                return res.status(401).json({
                    message : "could not remove quiz from exam",
                    success : false,
                })
            }
           
        }
        
       res.status(200).json({
            message : "subject have been remove from exam",
            success : true,
            result : quizs,
        })
          
    } catch (error) {
        res.status(502).json({
            message: "error server could not response",
            success : false,
        })
    }
}



module.exports = {getQuiz,createQuiz,updateQuiz,deleteQuiz , 
    findQuizById, quizQueryByExamId}
