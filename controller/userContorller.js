const users = require('../model/user')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
require('dotenv').config()

const usersAll = async (req,res)=>{
    const user = await users.find({})
 
    if (!user){
        return res.status(404).json({
            message: "no user found!"
        })
    }
    if (user.length == 0 ){
       return res.status(404).json({
            message: "No record found"
        })
    }
   
    res.status(200).json({
        data : user,
        name : req.body.name,
    
    })
}



const findUser = async (req,res)=>{

    const {id: user_id} = req.params
  
    try {
        
        const userId = await users?.findOne({_id: user_id})
        if(!userId){
            return res.status(404).json({message: `no user found here ...${user_id}`})
        }
        
       return res.status(200).json({userId})

    } catch (error) {
        res.status(500).json({message: `no user found ${error} ... ${user_id}`})
        
    }
}

const createUser = async (req, res,next) =>{
    let Users = new users({
        name: req.body.name,
        email : req.body.email,
        password:req.body.password,
        role:req.body.role,
    }) 

    try {
        const userExists = await users.findOne({email:Users.email})
        if (userExists){
            return res.status(500).json({
                message: "user already exist",
                success: false
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(Users.password, salt)
        Users.password = hashPassword
        


        Users = Users.save()

        if(Users){
            res.status(200).json(
                {
                    message: "create user successfully "
                    });
        }
        next()

    } catch (error) {
        res.status(401).json({
            message: "error server could not response"
    })
    }

}


const loginUser = async (req,res ,next) =>{
        try {


            const {name} = req.body
            const Users = await users.findOne({name})


            if(!Users){
                return res.status(400).json({
                    message : 'user name does not exits',
                    success : false
                })
                
            }
            const vailPassword = await bcrypt.compare(
                req.body.password,
                Users.password
            )
            if(!vailPassword){
                return res.status(500).send({
                    message: "Inavild credentails",
                    success: false
                })
            }

            const token = jwt.sign({
                userId: Users._id,
                name: Users.name},

                process.env.accessToken,{
                    expiresIn : '24h'
            })
            
        

           res.status(200).json({
                message: `User ${Users.role} logged is successfully`,
                success: true,
                name: Users.name,
                role: Users.role,
                token: token
            })

            next()

        } catch (error) {
            res.status(500).json({
                message: "User login not success",
                success:false,
            })
        }

    
}



const deleteUser = async (req,res)=>{

    const {id: user_id } = req.params
    try {
        const deleteUser = await users.findByIdAndDelete({_id : user_id})

        if(!deleteUser){
            return res.status(404).json({
                message : "Not Found user_id"
            })
        }

        res.status(200).json({
            message : "user have been remove",
            success : true
        })
        
    }catch(erorr){

        res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    
    }
}



const updateUser = async (req, res)=>{

    try {
        const {id: user_id} = req.params      
        const updateUser = await users.
        findByIdAndUpdate(user_id ,req.body, {new:true})

        if(!updateUser){
            return res.status(400).json({
                message : 'could not update user',
                success : false
            })
        }

        res.status(200).json({
            message : 'user update successfully',
            data : updateUser,
        })
        
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
  

}

const resetPassword = async (req ,res)=>{
    try{
        const {id} = req.params
        const token = req.headers["authorization"].split(' ')[1]
        const userRestPassword = await users.findOne({_id: id})
        const newpassword = req.body.password
         
        if(!userRestPassword){
          return  res.status(400).json({
                message : "user does not exist"
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
        const hashNewPassword = await bcrypt.hash(newpassword , salt)
        const userNewPassword = await users.findByIdAndUpdate({_id:id} , 
            {password : hashNewPassword} , {new:true})
        const successChange = userNewPassword.save()
        
        if(successChange){
            res.status(200).json({
                message : "password have been reset please logout to validate",
                success : true,
            })
        }


    }catch(error){
        res.status(500).json({
            message: "error server could not response"
    })
    }
}


module.exports = {createUser, findUser,usersAll, 
    loginUser , deleteUser , updateUser ,resetPassword}