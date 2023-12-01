const tests = require("../model/test")
const group = require("../model/group")


const testGet = async (req, res)=>{
    try {

        const testGet = await tests.find({})

        if(!testGet){
            return res.send("not test data")
        }else if(testGet.length < 1){
            return res.send("no record found")
        }
        
        res.json({testGet})

    } catch (error) {
        res.send("error not running")
    }
}


const testGetAll = async (req,res)=>{
    const  {id: t_id} = req.params
    const testGet = await tests.findOne({_id : t_id}).populate('child')
    res.send(testGet)


}

const testPost = async (req , res)=>{

    let Test = new tests(req.body)


    testse = await Test.save()

    if(testse){
        res.send("ok")
    }
}


const testPostMerge = async (req,res)=>{
    try{
        const {id: t_id} = req.params


        const getTEST = await tests.findOne({_id : t_id})
         getTEST.child.push(group._id)
        
         const saveTest = await getTEST.save()

          res.send({saveTest})

    }catch(erorr) {
        res.send(new Error())

    }
}


module.exports = {testGet, testPost ,testPostMerge , testGetAll}