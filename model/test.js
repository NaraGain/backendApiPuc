const mongoose = require("mongoose")


const parentSchema = new mongoose.Schema({
    title : {
        type : String
    },
    child: [{
        type : mongoose.SchemaTypes.ObjectId,
        ref : "group"
    }]
  
})

module.exports = mongoose.model('test', parentSchema) 
 

