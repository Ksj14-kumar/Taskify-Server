const router = require("express").Router()
const passport = require("passport")
const {AuthMiddleware}= require("../Authentication/Authmiddleware")
router.get("/success", async (req, res) => {
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
})
router.get("/failed", async (req, res) => {
    try {
        return res.status(200).json({ message: "login failed" })
    } catch (err) {
        return res.status(500).json({ message: "something error occured" })
    }
})
router.get("/google/login", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/login/github",passport.authenticate("github",{ scope: [ 'user:email' ] }))
router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", {
        failureRedirect: "/failed",
        successRedirect: process.env.UI_URL,
        successMessage:"successfull login",
        failureMessage:"not login"
    })(req, res, next)
})
router.get("/auth/github/callback", passport.authenticate('github', { failureRedirect: '/failed',successRedirect:process.env.UI_URL }))
router.get("/user",AuthMiddleware,async(req, res)=>{
    try {
        return res.status(200).json({name:req.user.name, email:req.user.picture,userId:req.user._id})
    } catch (err) {
        return res.status(500).json({message:"something error occured"})
    }
})
router.get("/logout",AuthMiddleware,async(req, res, next)=>{
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
})
module.exports = router;