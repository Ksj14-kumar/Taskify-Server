const mongoose = require("mongoose")
const Schema = mongoose.Schema({
    name: String,
    googleId: String,
    provider: String,
    email:String,
    picture:String,
    verify:Boolean
})
module.exports = mongoose.model("taskify", Schema)