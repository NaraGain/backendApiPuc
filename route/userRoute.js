const express = require('express')
const route = express.Router()



const {
    usersAll,
    findUser,
    createUser,
    loginUser,
    deleteUser,
    updateUser,
    resetPassword,
    findUserByName
    
} = require('../controller/userContorller')
const { auth, checkRole } = require('../middleware/auth')

route.get("/",auth ,usersAll)
route.get('/:id', auth ,findUser)
route.post('/username',auth, findUserByName)
route.post("/register",auth, checkRole(['superadmin','admin']), createUser)
route.post("/login", loginUser)
route.patch('/reset-password/:id' ,auth, checkRole(['superadmin','admin']), resetPassword)

route.patch("/update/:id",auth, checkRole(["superadmin","admin"]), updateUser)

route.delete("/:id",auth, checkRole(["superadmin"]),deleteUser)


module.exports = route