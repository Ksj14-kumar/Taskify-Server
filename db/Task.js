const mongoose= require("mongoose")
const Schema= mongoose.Schema({
    taskId:String,
    task:String,
    time:Number,
    status:String,
    header:String,
    userId:String
})
module.exports= new mongoose.model("tasks",Schema)