const express = require('express');
const { userController } = require('../controllers/UserController');
const {authService} = require('../services/Auth')

const userRoutes = express.Router();

// userRoutes.use(authService.authenticate)

userRoutes.get('/user',userController.getUsers)
userRoutes.get('/user/name',userController.getUserWithIdName)
userRoutes.put('/user',userController.updateUserInfo)
userRoutes.post('/user',userController.addUser)
userRoutes.post('/user/query',userController.updateDb)
userRoutes.delete('/user',userController.deleteUser)

module.exports= {
    userRoutes
}