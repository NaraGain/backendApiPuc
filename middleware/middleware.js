const jwt = require('jsonwebtoken')
const users = require("../model/user")
require('dotenv').config()

const withAuth = async (req, res,next)=>{
   const token = await req.headers['authorization']
   if(!token){
        return res.status(401).send('Access Denied / Unauthorized request')
    }

    try {
        token = token.split(' ')[1] //remove bear from string
        if(token === null){
            return res.status(401).send(("Unauthorized request"))
        }

        const verifiedUser = jwt.verify(token, process.env.JWTtoken)

        if(!verifiedUser){
            return  res.status(401).send("Unauthorized request")
        }

        req.users = verifiedUser
        next()

    } catch (error) {
        res.status(400).send("Invaild Token")
    }
}

module.exports = withAuth