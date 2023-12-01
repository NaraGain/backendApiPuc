const mongoose = require('mongoose')


const quizSchema = new mongoose.Schema({
      title : {
        type : String,
        require : true,
        maxlength : 50,
      },
      score : {
        type : Number,
        default : 50,
        maxlength : 100,
      },
      progress : {
        type : Number,
        default: 0,
        maxlength  : 100,
      },
      ExamId : {
        type : String,
        require : true,
      },
      question : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'question',
      }]   
},
{
    timestamps : true
})


module.exports = mongoose.model('quiz', quizSchema)