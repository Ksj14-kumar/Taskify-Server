const passport = require("passport")


module.exports.success=  async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            return res.status(200).jsonp({ name: req.user.name, pic: req.user.picture,userId:req.user._id })
        }
        else{
            return res.status(401).send({ message: "please, login first" })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "something error occured" })
    }
}


module.exports.failed=async (req, res) => {
    try {
        return res.status(200).json({ message: "login failed" })
    } catch (err) {
        return res.status(500).json({ message: "something error occured" })
    }
}
module.exports.googleCallBacke= (req, res, next) => {
    passport.authenticate("google", {
        failureRedirect: "/failed",
        successRedirect: process.env.UI_URL,
        successMessage:"successfull login",
        failureMessage:"not login"
    })(req, res, next)
}
module.exports.user= async(req, res)=>{
    try {
        return res.status(200).json({name:req.user.name, email:req.user.picture,userId:req.user._id})
    } catch (err) {
        return res.status(500).json({message:"something error occured"})
    }
}
module.exports.logout= async(req, res, next)=>{
    try {
        // req.destroy()
        req.logout(function(err){
            if(err){
                next(err)
            }
            return res.status(200).send("logout")
        })
    } catch (err) {
        return res.status(500).json({message:"something error occured"+err})
    }
}