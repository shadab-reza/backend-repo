const { mapconfigs, pgClient } = require('../config/DBConfig');
const { log } = require('../utils/loggerutil');

class CustomerService {

    columnsKeys = {
        name: "custame",
        email: "custEmail",
        phone: "custPhone",
        config: "config",
        allowed_users: "maxUser",
        expiry_date: "expiryDate"
    };
    configKeys = {
        user: "user",
        host: "host",
        database: "db",
        password: "pwd",
        port: "port"
    };

//     payLoad={
//     "custame": "tahira",
//     "custEmail": "tahiramail",
//     "custPhone": "9798933493",
//     "config": {
//         "user": "postgres",
//         "host": "localhost",
//         "db": "appdb",
//         "pwd":"admin",
//         "port": 5432
//     },
//     "maxUser": 100,
//     "expiryDate": "2030-12-31"
// };

    validateCustomer({ custId }) {
        console.log(custId);
        
        const appId = custId.replace(/"/g, '');
        return mapconfigs.has(appId);
    }

    async createCustomer(customer) {

        try {
            const map = new Map();
            let config = {};
            for (const [key, value] of Object.entries(this.configKeys)) {

                config[key] = customer.config[value];
            }
            customer.config = JSON.stringify(config);
            for (const [key, value] of Object.entries(this.columnsKeys)) {
                map.set(key, customer[value]);
            }

            pgClient.initClient(pgClient.defaultPool);
            return await pgClient.insertData([{ entity: 'customers', columnVal: map }]);

        } catch (error) {
            log(error.toString());
            return { status: 400, info: 'something went wrong' };
        }

    }

    async updateCustomer(customer) {

        try {
            const map = new Map();
            let config = {};
            for (const [key, value] of Object.entries(this.configKeys)) {

                config[key] = customer.config[value];
            }
            customer.config = JSON.stringify(config);
            for (const [key, value] of Object.entries(this.columnsKeys)) {
                map.set(key, customer[value]);
            }
            
            pgClient.initClient(pgClient.defaultPool);
            return await pgClient.updateRows([{ entity: 'customers', columnVal: map, clause: [{ key: 'id', value: customer.custId }] }]);
        } catch (error) {
            log(error.toString());
            return { status: 400, info: 'something went wrong' };
        }

    }

    loadCustomer() {
        pgClient.initClients();
    }
}

module.exports = new CustomerService();