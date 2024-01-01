const mongoose = require('mongoose')


const fileSchema = new mongoose.Schema({
    path : {
        type : Object,
        require : true,
    },
    name : {
        type : String,
        require:true
    }
},
{
    timestamps : true
}
)

module.exports = mongoose.model('file', fileSchema)