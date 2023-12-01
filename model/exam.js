const mongoose = require('mongoose')


const examSchema = new mongoose.Schema({
    name : {
        type : String,
        require :true,
    },
    startDate :{
        type : String,
        require : true
    },
    endDate :{
        type : String,
        require : true
    },
    pass_score :{
        type : Number,
        require : true,
    },
    key : {
        type : Number,
        default : null,
    },
    time :{
        type : Number,
    },
    course : {
        type : String,
        require : true
    },
    description : {
        type : String,
        
    },
    quiz : [{
        type : mongoose.Schema.ObjectId,
        ref : 'quiz',
        require : true,
    }]

},
{
    timestamps : true
}

)

module.exports = mongoose.model('exam', examSchema)