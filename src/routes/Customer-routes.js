const { customerController } = require('../controllers/Customer-controller');
const express = require('express');
const customerRoutes = express.Router();

customerRoutes.post('/validate', customerController.validateCustomer);
customerRoutes.post('/create', customerController.createCustomer);
customerRoutes.get('/customers', customerController.getCustomers);
customerRoutes.put('/update', customerController.updateCustomer);

module.exports = {
    customerRoutes
}