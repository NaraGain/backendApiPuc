const express = require('express')
const { getGroup, createGroup, findGroupById, deleteGroup, createTest, updateGroup, studentQueryGroup } 
= require('../controller/groupContorller')
const route = express.Router()
const {auth, checkRole} = require("../middleware/auth")







route.get('/' ,getGroup)
route.post('/create',auth , checkRole(['Owner','admin',"staff"]), createGroup)
route.post('/', findGroupById)
route.delete('/delete/:id', checkRole(['Owner', 'admin']), deleteGroup)
route.patch('/update/:id', checkRole(["Owner", 'admin']), updateGroup)
route.post("/post", createTest)
route.post("/student/query", studentQueryGroup)


module.exports = route