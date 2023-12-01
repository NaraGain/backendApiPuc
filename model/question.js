const mongoose = require('mongoose')



const questionSchema = new mongoose.Schema({
   name : {
        type :String,
   },
   question : {
    type :String,
    require : true,
   },
   description : {
    type : String,
   },
    upload : {
        type : Object,
   },
   onAnswer : {
        type : Boolean,
        default : false,
   },
   point : {
     type : Number,
     default : 1,
   },
   correctAnswer : {
        type : Array,
        default : ['A1']
   },
   options : {
        type : Array,
   },
   subId :{
     type : String,
     require : true,
   }
},

{
    timestamps : true
}
)


module.exports  = mongoose.model('question', questionSchema)