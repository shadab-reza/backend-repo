const express = require('express');
const { taskController } = require('../controllers/TaskController');
const {authService} = require('../services/Auth')

const taskRoutes = express.Router();

// userRoutes.use(authService.authenticate)

taskRoutes.get('/task',taskController.getTasks)
taskRoutes.post('/task',taskController.addTask)
taskRoutes.put('/task',taskController.updateTask)
taskRoutes.put('/task/status',taskController.updateTaskStatus)
taskRoutes.delete('/task',taskController.deleteTask)

module.exports= {
    taskRoutes
}