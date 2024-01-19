const exam = require("../model/exam")
const question = require("../model/question")
const quiz = require("../model/quiz")
const files = require('../model/file')
const fs = require('fs').promises
const path = require('path')



const getQuestion = async (req,res)=>{

try {
    const getQuestion = await question.find({})

    if(!getQuestion){
        return res.status(404).json({
            message : "not found exam",
            success : false,
        })
    
    }

    if(getQuestion.length < 1){
        return res.status(404).json({
            message : "No record found",
            success : false,
        })
    }

     res.status(200).json({
        message : 'report found',
        result : getQuestion,
        success : true,
    })
    
} catch (error) {
    res.status(502).json({
        message: "error server could not response",
        success : false,
      
    })
}

}

const getQuestionById = async (req, res)=>{
    try {
        const questions = await question.findById({_id: req.body.id})
        if(!question){
            return res.status(404).json({
                message : "not found exam"
            })
        }

        res.status(200).json({
            message : "question are query",
            result : questions,
        })
    } catch (error) {
        res.status(502).json({
            message: "error server could not response"
        })
    }
}


const getQuestionByPage = async (req,res)=>{

    try {
        const {page = 1 , limit = 1, name} = req.query

        const questions = await question
        .find().limit(limit * 1).skip((page - 1) * limit).exec()
         
        const count = await question.count()
        const Question = await question.find({})
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = Question.slice(startIndex ,endIndex)

        if(!questions){
            return res.status(401).json({
                message : 'could not render question'
            })
        }
        
        if(!count) {
            return res.status(401).json({
                message : 'Count is error'
            })
        }

        res.status(200).json({
            message : "question are query",
            currentPage : page,
            totalPages: Math.ceil(count / limit),
            page : count ,
            data : result
        })

    } catch (error) {
        res.status(502).json({
            message: "error server could not response"
          
        })
    }
}

const testuploadfile = async (req,res ,next)=>{
    try {

       const file = req.files.file
       let fileName = file?.md5 + file?.name
       const uploadPath = path.join(__dirname , '../public/upload/' + `${fileName}`)
        const {id : q_id} = req.params
        const quizs = await quiz.findOne({_id : q_id})
        const questionUpload = await new question({
            upload : {path : `/${fileName}` , type : file.mimetype},
            subId : q_id,
        },)

        const Files = new files({
            path : {
                url : `/${fileName}`,
                type : `${file.mimetype}`
            },
            name : `question`,
        })


        if(!quizs){
            return res.status(401).json({
                message : "could not find subject name",
                success : false,
            })
        }
        const questionUploadSave = await questionUpload.save()
        quizs.question.push(questionUploadSave._id)
        const saveQuestionToSubject = await quizs.save()
        const saveToFile = await Files.save()
        if(!saveQuestionToSubject){
            return res.status(401).json({
                message : "could not save to subject name",
                success : false,
            })
        }

        await file.mv(uploadPath)
        res.status(200).json({
            message : "file have been save to subject",
            questionId : questionUploadSave._id,
            success : true,
        })
    } catch (error) {
        res.status(401).json({
            message : "error server could not response",
        })
    }

}

const createQuestion = async (req,res,next)=>{
    try {
        if(req.body.questionId){
         var Question = await 
            question.findByIdAndUpdate(req.body.questionId , req.body , {new:true})
            if(!Question){
                return res.status(401).json({
                    message : 'could not update Question',
                    success : false,
                })
            }

            res.status(200).json({
                message : "success update exam",
                success : true
                })    
        }else{
            const {id: q_id} = req.params
            const questionCreate = new question(req.body)
            const questions = questionCreate.save()
            if(!questions){
                return res.status(401).json({
                    message : "could not create exam",
                    success : false
                })
            }
            const quizs = await quiz.findOne({_id : q_id})
            quizs.question.push(questionCreate._id)
            const saveToQuiz = await quizs.save()
            if(saveToQuiz){
                return res.status(200).json({
                    message : "create sucessfully exam",
                    success : true
                })
            }
        }
       
        next()
        
    }catch (error) {
        console.log(error)
        res.status(500).json({
            message: "error server could not response🫠"
          
        })
    }
}

const questionUpdate = async (req,res,next)=>{
    try {
        const findQuestion = await question.findByIdAndUpdate({_id : req.params.qid} 
            , req.body, {new:true})

         if(!findQuestion){
            return res.status(401).json({
                message : "unable to update question",
                success : false 
            })
         }   

         res.status(200).json({
            message : "update question successfully",
            success : true,
         })

    } catch (error) {
        res.status(502).json({
            message: "error server could not response",
            success: false
        })
    }

}

 const deleteQuestion = async (req,res)=>{

    try {

       const findSection = await quiz.findOne({_id : req.params.subId})

        if(findSection?.question.length !== 0){
          const removeQuestonId =  findSection?.question.remove(req.params.id)
          if(removeQuestonId){
            await findSection.save()
          }    
        }
        
       
        
        const deleteQuestion = await question.findByIdAndDelete({_id : req.params.id})
        if(deleteQuestion?.upload){
            await fs.unlink(path.join(__dirname , '../public/upload/', deleteQuestion?.upload?.path))
        }else{
            return res.status(400).json({
                message : "question on file",
                success : false
            })
        }
        if(!deleteQuestion){
            return res.status(404).json({
                message : "question is not match",
                success : false,
            })
        }
        res.status(200).json({
            message : "question have been remove",
            success : true,
        })

    }catch (error) {
        res.status(502).json({
            message: "error server could not response",
            success : false,
          
        })
    }



 }


module.exports = {getQuestion , getQuestionById, createQuestion, deleteQuestion,
     testuploadfile , getQuestionByPage , questionUpdate}