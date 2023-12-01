const address = require('../data/address')



const getAddress = async (req,res)=>{
    try {
        
        if(!address){
            res.status(400).json({
                message : "no address found"
            })
        }

        res.status(200).json({
            address : address
        })


    } catch (error) {
        res.status(500).json({
            message : "error internal server"
        })
    }
}


module.exports = {getAddress}
