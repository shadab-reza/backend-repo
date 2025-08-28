const express = require('express');
const { branchController } = require('../controllers/branchcontroller');
const {authService} = require('../services/Auth')

const branchRoutes = express.Router();

// branchRoutes.use(authService.authenticate)

branchRoutes.get('/branchs',branchController.getAccountTypes)
branchRoutes.put('/branchs',branchController.updateAccountType)
branchRoutes.post('/branchs',branchController.addAccountType)
branchRoutes.delete('/branchs',branchController.deleteAccountType)

module.exports= {
    branchRoutes
}