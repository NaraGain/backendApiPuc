const errorHandlerMiddleware = (err,req,res,next)=>{
    return res.status(502).json({
        message: "error server could not response",
        success : false,
    })
    }
    
    module.exports = errorHandlerMiddleware