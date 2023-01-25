module.exports.AuthMiddleware= async(req, res, next)=>{
    console.log("user")
    console.log(req.user)
    if(req.user){
        next()
    }
    else{
        return res.status(401).json({message:"login first"})
    }
    
}