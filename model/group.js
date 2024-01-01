const mongoose = require('mongoose')



const groupSchema = new mongoose.Schema({
    group : {
        type : String,
        require : true,
        maxlength : 20
    },
    class:{
        type : String,
        require : true,
        maxlength : 20
    },

    //ref is refrence to a model
    teacher : {
       type: String,
       require : true,
       ref : 'user'
    },
    level : {
            type : String,
            require : true,
    },
    time : {
         type: [Date],
         require : true
    },
    exam : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'exam'
    }
    ],

    student : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'student',
            require : true
            
        }
    ]

    
},
{
    timestamps :true
}


)



module.exports = mongoose.model('group', groupSchema)