var GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleDB = require("../db/User")
const GitHubStrategy= require("passport-github2").Strategy
module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.Google_client_id,
        clientSecret: process.env.Google_client_secret,
        callbackURL: process.env.BACKEND_URL+"/api/v1/google/callback",
        passReqToCallback:true
    },
        function (req,accessToken, refreshToken, profile, done) {
            console.log({ profile,refreshToken,accessToken })
            GoogleDB.findOne({ googleId: profile.id },   async function (err, user) {
                if(err){
                    return done(null,false)
                }
                else if(!user){
                    //save user of not in db
                    const User= await new GoogleDB({
                        name:profile.displayName,
                        googleId:profile.id,
                        provider:profile.provider,
                        email:profile.email,
                        picture:profile._json.picture,
                        verify:profile._json.verify
                    })
                    User.save(async(err)=>{
                        if(err){
                            console.log("user is not save")
                            return done(null, false)
                        }
                        else{
                            const user= await GoogleDB.findOne({googleId:profile.id})
                            return done(null, user)
                        }
                    })
                }
                else{
                    return done(null, user);
                }
            });
        }
    ));
    passport.use(new GitHubStrategy({
        clientID:process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.BACKEND_URL+"/auth/github/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        console.log({profile})
        GoogleDB.findOne({ googleId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));
    //PASSWORD DESCRILIZE AND STRATEGY
    passport.serializeUser(function (user, done) {
        console.log("serielize")
        console.log(user)
        return done(null, user.googleId);
    });
    passport.deserializeUser(function (id, done) {
        console.log("deserize")
        GoogleDB.findOne({googleId:id}, function (err, user) {
            if (err) {
                return done(null, false);
            }
            else {
                return done(null, user)
            }
        });
    });
}
