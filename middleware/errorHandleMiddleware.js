const errorHandlerMiddleware = (err,req,res,next)=>{
    return res.status(500).json({msg: `Error internal server 😭 `})
    }
    
    module.exports = errorHandlerMiddleware