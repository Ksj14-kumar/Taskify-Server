const { AuthMiddleware } = require("../Authentication/Authmiddleware")
const router = require("express").Router()
const taskController= require("../Controller/TaskController")
router.post("/add", AuthMiddleware,taskController.addTask)
router.get("/user/:id",AuthMiddleware,taskController.getTasks)
router.put("/update/:userId/:taskId",AuthMiddleware,taskController.updateTask)
router.put("/update/edit/:userId/:taskId",AuthMiddleware,taskController.editTask)
module.exports=router