const jwt = require("jsonwebtoken");
require("dotenv").config()
const users = require("../model/user");


const auth = async (req,res,next)=>{

    try{
        const token = req.headers["authorization"].split(' ')[1]
        const decodeTaken = await jwt.verify(token, process.env.accessToken)    
        const user = await decodeTaken
        if(!user){
            return res.json({
                message : "user authorized"
            })
        }
        req.body.user = user
        next()
    }catch(e){
        res.status(401).json({
            message: "Unauthorized user",
        })
    }
}

const checkRole = (role)=> {
    return async (req,res,next)=>{ 
        try {
            const {name}  = req.body.user
            const User = await users.findOne({name})
            var result = false
            //check user role array
            for(var i = 0 ; i<role.length ; i++){
                for(var j =0; j<User.role.length ; j++){
                    if(role[i] !== User.role[i]){
                        result = false
                        continue
                  
                    }else{
                        result = true
                        break
                  
                    }
                }
                if(result){
                    break
                }else{
                    i++
                    continue
                }
            }

           if(role.includes(User.role.toString())){  
               next()
           }else{
               res.status(401).json({message:false})
           }   
        } catch (error) {
            res.status(500).json({
                message : "error Internal server could response"
            })
        }
       
      
    }
}

module.exports = {auth , checkRole}

