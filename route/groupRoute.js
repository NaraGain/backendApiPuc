const express = require('express')
const { getGroup, createGroup, findGroupById, deleteGroup, createTest, updateGroup} 
= require('../controller/groupContorller')
const route = express.Router()
const {auth, checkRole} = require("../middleware/auth")







route.get('/' ,auth ,getGroup)
route.post('/create',auth , checkRole(['superadmin','admin',"staff"]), createGroup)
route.post('/', auth ,findGroupById)
route.delete('/delete/:id',auth, checkRole(['superadmin', 'admin']), deleteGroup)
route.patch('/update/:id', auth,checkRole(["superadmin", 'admin']), updateGroup)
route.post("/post",auth, createTest)


module.exports = route