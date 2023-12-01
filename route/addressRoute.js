const express = require('express')
const { getAddress } = require('../controller/addressController')
const route = express.Router()



route.get("/",getAddress )


module.exports = route