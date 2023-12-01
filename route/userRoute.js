const express = require('express')
const route = express.Router()



const {
    usersAll,
    findUser,
    createUser,
    loginUser,
    deleteUser,
    updateUser,
    resetPassword
    
} = require('../controller/userContorller')
const { auth, checkRole } = require('../middleware/auth')

route.get("/",auth ,checkRole(['Owner', "admin"]),usersAll)
route.get('/:id',findUser)

route.post("/register",auth, checkRole(['Owner','admin']), createUser)
route.post("/login", loginUser)
route.patch('/reset-password/:id' ,auth, checkRole(['admin']), resetPassword)

route.patch("/update/:id",auth, checkRole(["Owner","admin"]), updateUser)

route.delete("/:id",auth, checkRole(["Owner"]),deleteUser)


module.exports = route