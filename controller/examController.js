const exam = require("../model/exam");
const group = require("../model/group");
const questions = require("../model/question")



var generateRandomNDigits = (n) => {
    return Math.floor(Math.random() * (9 * (Math.pow(10, n)))) + (Math.pow(10, n));
  }

const getExam = async (req,res)=>{
    
    try {

        const exams = await exam.find({})

        if(!exams){
            return res.status(404).json({
                message : "not found exam"
            })
        }

        if (exams.length < 1){

            return res.status(404).json({
                message : "No record found"
            })
        }
      
        res.status(200).json({exams})
        
    } catch (error) {
        res.status(502).json({
            message : "error Internal server could not response."
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
         exams
    })
    
} catch (error) {
    res.status(502).json({
        message : "error Internal server could not response."
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
                message : "You could not create more than 10"
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
            error_case : new Error()
          })
        
    }
}

const testPost = async(req,res,next)=>{
    try {
       
    } catch (error) {
        console.log(error)
    }
}

const updateExam = async (req,res)=>{
    try {
        const exams = await exam.findByIdAndUpdate({_id :req.body.id}, {new:true})

        if(!exams){
            return res.status(400).json({
                message : 'could not update user something was wrong.',
                success : false,
            })
        }

        res.status(200).json({
            message : 'quiz update successfully',
            data : exams,
        })

    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
}

const deleteExam = async (req,res)=>{
    try {

        const {id : e_id , course : course} = req.params
        const groups = await group.findOne({group: course})
            const slice =  groups.exam.remove(e_id)
            if(slice){
                await groups.save()  
                var exams = await exam.findByIdAndDelete({_id: e_id}) 
                        
             }
        if(exams){
            for(let i = 0 ;i < exams.quiz.length ; i++){
                await questions.findByIdAndDelete(exams.question[i])
            }
        }
        
        if(!exams){
            return res.status(401).json({
                message : "could not romve",
                success : false
            })
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



module.exports = {getExam ,
    testPost,
    findExamById, finedQuestionById, createExam , deleteExam , updateExam}