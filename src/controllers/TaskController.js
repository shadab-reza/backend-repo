const { taskService } = require('../services/TaskService');

class TaskController {

    async addTask(req, res) {
        let body = req.body;
        // console.log(body);
        if (typeof body.taskList === 'string') {
            body.taskList = JSON.parse(body.taskList);
        }

        let tasks = [];

        body.taskList.forEach(task => {
            let aTask = {};
            aTask.task = task.task;
            aTask.duration = task.duration;
            aTask.status = task.status;
            aTask.userId = body.userId;
            tasks.push(aTask);
        });

        let response = await taskService.addTask(tasks);
        // console.log(status);        
        res.status(response.status).send(response);
    }

    async updateTask(req, res) {
        let body = req.body;
        // console.log(body);
        if (typeof body.taskList === 'string') {
            body.taskList = JSON.parse(body.taskList);
        }

        let tasks = [];

        body.taskList.forEach(task => {
            let aTask = {};
            aTask.taskId = task.taskId;
            aTask.task = task.task;
            aTask.duration = task.duration;
            aTask.status = task.status;
            aTask.userId = body.userId;
            tasks.push(aTask);
        });
        let status = await taskService.updateTask(tasks);
        // console.log(status);        
        res.send(status);
    }

    async updateTaskStatus(req, res) {
        let status = await taskService.updateTaskStatus(req.body);
        // console.log(status);        
        res.send(status);
    }

    async getTasks(req, res) {
        let response = await taskService.getTasks({userid:req.query.userid,page:req.query.page|| 1, size:req.query.size||10 });
        res.status(response.status).send(response);
    }

    async deleteTask(req, res) {
        let result = await taskService.deleteTask(req.body);
        // console.log(result);
        res.status(result.status).send(result);
    }
}

const taskController = new TaskController();

module.exports = {
    taskController
}