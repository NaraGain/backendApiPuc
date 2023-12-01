const express = require('express')
const route = express.Router()

const 
{testPost, testGet, testPostMerge, testGetAll} 
= require("../controller/testContorller")


route.get("/", testGet)
route.get("/getAll/:id",testGetAll)
route.post("/post",testPost)
route.post("/post/:id",testPostMerge)


module.exports = route