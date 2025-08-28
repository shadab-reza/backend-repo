const express = require('express');
const { accountTypeController } = require('../controllers/AccountTypeController');
const {authService} = require('../services/Auth')

const accountTypeRoutes = express.Router();

// branchRoutes.use(authService.authenticate)

accountTypeRoutes.get('/account_type',accountTypeController.getAccountTypes)
accountTypeRoutes.put('/account_type',accountTypeController.updateAccountType)
accountTypeRoutes.post('/account_type',accountTypeController.addAccountType)
accountTypeRoutes.delete('/account_type',accountTypeController.deleteAccountType)

module.exports= {
    accountTypeRoutes
}