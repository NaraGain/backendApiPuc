const express = require('express')
const { getGroup, createGroup, findGroupById, deleteGroup, createTest, updateGroup, studentQueryGroup } 
= require('../controller/groupContorller')
const route = express.Router()
const {auth, checkRole} = require("../middleware/auth")







route.get('/' ,getGroup)
route.post('/create',auth , checkRole(['superadmin','admin',"staff"]), createGroup)
route.post('/', findGroupById)
route.delete('/delete/:id',auth, checkRole(['superadmin', 'admin']), deleteGroup)
route.patch('/update/:id', auth,checkRole(["superadmin", 'admin']), updateGroup)
route.post("/post",auth, createTest)
route.post("/student/query", auth, studentQueryGroup)


module.exports = route