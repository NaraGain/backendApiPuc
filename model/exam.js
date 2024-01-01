const mongoose = require('mongoose')


const examSchema = new mongoose.Schema({
    name : {
        type : String,
        require :true,
    },
    date :{
        type : Date,
        require : true
    },
    time :{
        type : Date,
        require : true
    },
    end : {
        type : Date,
        require : true,
    },
    pass_score :{
        type : Number,
        require : true,
    },
    key : {
        type : Number,
        default : null,
    },
    duration :{
        type : Number,
        default:55,
    },
    course : {
        type : String,
        require : true
    },
    onfinish : {
        type : Boolean,
        default : false,
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