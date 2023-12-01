const mongoose = require('mongoose')


const studentSchema = new mongoose.Schema({
    firstname : {
        type : String,
        require : true,
    },
    lastname : {
        type : String,
        require :true,
    },
    username: {
        type : String,
        require : true,
    },
    email : {
        type : String,
        require : true,
    },
    password : {
        type : String,
        require:true
    },
    address : {
        type : String,
        require : true,
    },
    dateBirth : {
        type : String,
        require : true,
    },
    parentPhone : {
        type : String,
        require : true
    },
    personalPhone : {
        type : String,
        require : true
    }, 
    courseName : {
        type : String ,
    },
    description :{
        type : String,
        default : null
    },
    course : [
    {
        type : mongoose.Schema.ObjectId,
        ref : 'group'
    }
    ]
},

{
    timestamps : true
}
)


module.exports = mongoose.model('student', studentSchema)