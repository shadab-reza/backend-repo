const express = require('express');
const { userController } = require('../controllers/UserController');

const publicRoutes = express.Router();

publicRoutes.post('/login',userController.login)
publicRoutes.post('/user/login',userController.userLogin)
publicRoutes.post('/register',userController.addUser)

module.exports={
    publicRoutes
}