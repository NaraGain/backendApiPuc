const group = require('../model/group')
const test = require('../model/test')
const exams = require("../model/quiz")





const getGroup = async (req,res)=>{
    const groups = await group.find({})

    if(!groups){
        return res.status(404).json({
            message : 'not found groups'
        })
    }

    if (groups.length == 0 ){
        return res.status(404).json({
            message : "No record found"
        })
    }

    res.status(200).json({groups})

}


const studentQueryGroup =  async (req,res)=>{

    try {
        
        const groups = await group.findOne({group : req.body.courseName})

        if(!groups){
            return res.status(404).json({
                message : "Not Found course name",
                success : false,
            })
        }

        res.status(200).json({
            message : "query successfully",
            success : true,
            result : groups

        }) 
    } catch (error) {
        
    }


}

const findGroupById = async (req,res)=>{

    try {
        const g_id = req.body.id
        
        const groups = await group.findOne({_id : g_id}).populate('exam').populate('student')

        if (!groups){
            return res.status(404).json({
                message : "not found group ",
                success : false,
            })
        }
        res.status(200).json({groups})

    } catch (error) {
        res.status(502).json({
            message: "error server could not response",
            success : false,
        })
    }

}


const createTest =  async (req, res , next)=>{
    try{

        const tests = await new test({
            title : req.body.title
        })

       const Test = await tests.save()
       
       if(Test){
        return res.status(200).json({
           message : "create successfully "
        })
       }

    next()

    }catch(erorr){
        res.status(502).json({
            message : "error Internal server could not response."
        })
    }
}


const createGroup = async (req,res ,next)=>{
  
   try{
    const groups = new group(req.body)   
    const findGroup = 
    await group.findOne({group : groups.group})
    
    if (findGroup){
        return res.status(502).json({
            message : "group already exist",
            success : false,
        })
    }

    var Group = await groups.save()
  

    if(Group){
       return res.status(200).json({
            message : "create user successfully",
            success : true
        })
    }

    next()

   } catch(err) {
    res.status(502).json({
        message: "error server could not response"
      })
   }


}


const updateGroup = async (req,res)=>{
    try{
        const {id : g_id} = req.params
        const updateGroup = await group.findByIdAndUpdate(g_id ,req.body , {new:true})

        if(!updateGroup){
            return res.status(502).json({
                message: "error server could not response",
                success : false
            })
        }
        res.status(200).json({
            message : 'Group update successfully',
            data : updateGroup,
            success: true
        })

    }catch(error){
        res.status(502).json({
            message: "error server could not response",
            success: false
        })
    }
}


const deleteGroup = async (req,res)=>{
    try{

        const {id: g_id} = req.params
        
        const deleteGroup = await group.findByIdAndDelete({_id : g_id})

        if(deleteGroup.exam){
            for (let i = 0 ;i <deleteGroup.exam.length; i++){
                await exams.findByIdAndDelete(deleteGroup.exam[i])
            }
        }

        if (!deleteGroup){
            return res.status(404).json({
                message : "Not Found groud_id",
                success : false,
            })
        }
    
        res.status(200).json({
            message : "course have been remove",
            success : true,
        })

    }catch(erorr){
        res.status(502).json({
            message: "error server could not response",
            success : false,
        })
    }
}

module.exports = {
    getGroup ,createGroup, findGroupById ,
    deleteGroup , createTest , updateGroup,
    studentQueryGroup,

}

