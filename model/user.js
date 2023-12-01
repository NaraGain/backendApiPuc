const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
     type:String,
     require:false,
    },
    password:{
        type:String,
        require:true,
    },
    role:{
        type:Array,
        require:true
    },
   
},
{
    timestamps:true

}
)

module.exports = mongoose.model('user',userSchema)