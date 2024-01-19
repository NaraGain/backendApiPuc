const group = require('../model/group')
const test = require('../model/test')
const exams = require("../model/quiz")


const getGroup = async (req,res)=>{

    try {
        const groups = await group.find({})

    if(!groups){
        return res.status(404).json({
            message : 'not found groups',
            success : false
        })
    }

    if (groups.length == 0 ){
        return res.status(404).json({
            message : "No record found",
            success : false,
        })
    }

    res.status(200).json({
        message : 'fetch group...',
        groups : groups,
        success : true
    })

    
    } catch (error) {
        res.status(502).json({
            message: "error server could not response",
            success : false,
        })
    }
    

}



const findGroupById = async (req,res)=>{
    try {
        const g_id = req.body.id
        const groups = await group.findOne({_id : g_id})
        .populate('exam').populate('student')

        if (!groups){
            return res.status(404).json({
                message : "not found group ",
                success : false,
            })
        }

        const items = {
            _id : groups._id,
            group : groups.group,
            class : groups.class,
            teacher : groups.teacher,
            level : groups.level,
            time : groups.time,
            exam : groups.exam.map((exam ,key)=> ({
                index : key,
                _id : exam._id,
                name : exam?.name,
                pass_score : exam.pass_score,
                key : exam.key,
                course : exam.course,
                quiz : exam.quiz.length,
                description : exam.description,
                duration : exam.duration,
                date : exam.date,
                time : exam?.time,
                onfinish : exam?.onfinish,
                createdAt : exam?.createdAt,
                updatedAt :exam?.updatedAt,

            })),
            student : groups.student.map((student,key)=> ({
                index : key,
                _id : student?._id,
                firstname : student?.firstname,
                lastname : student?.lastname,
                username : student?.username,
                email : student?.email,
                gender : student?.gender,
                address : student?.address,
                personalPhone : student?.personalPhone,
                parentPhone : student?.parentPhone,
                dateBirth : student?.dateBirth,
                courseName : student?.courseName,
                createdAt : student?.createdAt,
                description : student?.description,
            }))


            
        }


        res.status(200).json({
            message : 'groups founds',
            success : true,
            groups : items
        })

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
        
        const findGroup = await group.findOne({_id : g_id})
        if(findGroup?.exam.length !==0 && findGroup?.student.length !== 0){
                return res.status(400).json({
                    message : 'group is not empty',
                    success : false,
                })
        }else{
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

}

