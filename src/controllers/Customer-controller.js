const CustomerService = require('../services/Customer-service');

class CustomerController {
    async validateCustomer(req, res) {
        let response = CustomerService.validateCustomer(req.body);
        res.status(200).send({ status: 200, valid: response });
    }

    async createCustomer(req, res) {
        let response = CustomerService.createCustomer(req.body);
        res.send({ ...response });
    }

    async updateCustomer(req, res) {
        let response = CustomerService.updateCustomer({ ...req.body });
        res.send({ ...response });
    }

    async getCustomers(req, res) {
        CustomerService.loadCustomer();
        res.status(200).send({ status: 200 });
    }


}
const customerController = new CustomerController();

module.exports = {
    customerController
}