const router = require("express").Router()
const passport = require("passport")
const {AuthMiddleware}= require("../Authentication/Authmiddleware")
const AuthController= require("../Controller/AuthController")
router.get("/success",AuthController.success)
router.get("/failed", AuthController.failed)
router.get("/google/login", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/login/github",passport.authenticate("github",{ scope: [ 'user:email' ] }))
router.get("/google/callback", AuthController.googleCallBacke)
router.get("/auth/github/callback", passport.authenticate('github', { failureRedirect: '/failed',successRedirect:process.env.UI_URL }))
router.get("/user",AuthMiddleware,AuthController.user)
router.get("/logout",AuthMiddleware,AuthController.logout)
module.exports = router;