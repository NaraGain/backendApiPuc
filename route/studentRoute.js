const express = require('express')
const { getStudent, createStudent, loginStudent, getStudentById } = require('../controller/studentController')
const route = express.Router()


route.get("/", getStudent)
route.post("/create", createStudent)
route.post("/login", loginStudent)
route.post("/get", getStudentById)

module.exports = route