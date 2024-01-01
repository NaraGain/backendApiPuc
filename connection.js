
const {mongoose} = require('mongoose')



const connectionDb =  (url) => {
return mongoose.connect(url,{
    useUnifiedTopology:true,
    // useNewUrilParser : true,
    // useCreateIndex: true,
    // useFindAndModify: false,

}).then(()=>{
    console.log("Connected to Database is Successfully")
}).catch( err => {
    console.log("Cannot connect to the database ")
})
}






module.exports = {connectionDb}