const { AuthMiddleware } = require("../Authentication/Authmiddleware")
const router = require("express").Router()
const Task = require("../db/Task")
router.post("/add", AuthMiddleware, async (req, res) => {
    try {
        const userTasks = req.body
        console.log(userTasks)
        const saveUserTask = await new Task({
            taskId: userTasks.id,
            task: userTasks.task,
            time: userTasks.time,
            status: userTasks.status,
            header: userTasks.header,
            userId:userTasks.userId
        })
        await saveUserTask.save()
        return res.status(200).send("added")
    } catch (err) {
        return res.status(500).json({ message: "something error occured"})
    }
})
router.get("/user/:id",AuthMiddleware,async(req, res)=>{
    try {
        const id= req.params.id
        const userTask= await Task.find({userId:id})
        console.log(userTask)
        return res.status(200).json(userTask)
    } catch (err) {
        return res.status(500).json({message:"something error occured"})
    }
})
router.put("/update/:userId/:taskId",AuthMiddleware,async(req, res)=>{
    try {
        // console.log(req)
        const userId= req.params.userId
        const tId= req.params.taskId
        const status= req.body.status
        const time= req.body.time
      
        const userTask= await Task.findOneAndUpdate({$and:[{userId},{taskId:tId}]},{$set:{status:status,time:time}})
        console.log(userTask)
        return res.status(200).json({message:"update"})
    } catch (err) {
        return res.status(500).json({message:"something error occured"+err})
    }
})
router.put("/update/edit/:userId/:taskId",AuthMiddleware,async(req, res)=>{
    try {
        // console.log(req)
        const userId= req.params.userId
        const tId= req.params.taskId
        const task= req.body.task
        const time= req.body.time
      
        const userTask= await Task.findOneAndUpdate({$and:[{userId},{taskId:tId}]},{$set:{task:task,time:time}})
        console.log(userTask)
        return res.status(200).json({message:"update"})
    } catch (err) {
        return res.status(500).json({message:"something error occured"+err})
    }
})
module.exports=router