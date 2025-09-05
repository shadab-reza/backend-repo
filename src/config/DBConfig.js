// const { mapconfigs } = require('./instances-config');
const { Pool } = require('pg');
const env = require('dotenv').config();
const { log } = require('../utils/loggerutil');
const mapconfigs = new Map();

const isProduction = process.env.env === 'prod';

const response = {
    status: 400,
    info: 'Something Wrong!',
    data: []
};

class DbConfig {

    defaultPool = 'defaultPool';
    cureentPoolId = '';
    constructor() {
        this.poolMap = new Map();
        this.initClients();
    }

    async initClients() {

        try {

            this.pool = this.initPool({ ...process.env, port: process.env.dbport });
            this.poolMap.set(this.defaultPool, this.pool);

            const res = await this.fetchRows('customers', []);

            if (res.status == 200) {
                res.data.forEach((customer) => {
                    mapconfigs.set(customer.id, customer);
                    this.poolMap.set(customer.id, this.initPool(customer.config));
                });
            } else {
                log('failed to load clients.');
            }
        } catch (error) {
            log(error);
            console.log(error);

        }
    }

    initPool(value) {
        return new Pool({
            user: value.user,
            host: value.host,
            database: value.database,
            password: value.password,
            port: parseInt(value.port),
            idleTimeoutMillis: 30000,      // close idle clients after 30 seconds
            connectionTimeoutMillis: 4000, //
            ssl: isProduction
                ? {
                    rejectUnauthorized: false, // for self-signed certs
                }
                : false,
        });
    }

    initClient(client) {
        log("Initializing PG client for appid:" + client);

        try {
            this.pool = this.poolMap.get(client.replace(/"/g, ''));
            this.cureentPoolId=client;
        } catch (error) {
            return { status: 400, info: 'Invalid client appid!' };
        }

    }

    prepareInsertQueries(values) {
        let queries = '';

        try {
            values.forEach((data) => {
                let colums = [];
                let values = [];

                data.columnVal.forEach((value, key) => {
                    colums.push(key);
                    if (typeof value === 'string') {
                        values.push(`'${value}'`);
                    } else {
                        values.push(value);
                    }
                })

                let query = `insert into ${data.entity} (${colums.join(',')}) values (${values.join(',')})`

                if (data.returningRows) {
                    query += ` returning user_id;`;
                } else {
                    query += `;`;
                }
                // console.log(query);
                queries += query;
            })
            console.log(queries);
        } catch (error) {
            console.log(error);
        }
        return queries;
    }

    prepareUpdateQueries(updateModels) {
        // console.log(updateModels.length);

        let queries = '';

        try {

            updateModels.forEach(updateModel => {
                let values = [];
                let query = '';
                updateModel.columnVal.forEach((value, key) => {
                    if (typeof value === 'string') {
                        values.push(`${key}='${value}'`);
                    } else {
                        values.push(`${key}=${value}`);
                    }
                })

                query = `update ${updateModel.entity} set ${values.join(',')} `

                if (updateModel.clause) {
                    query += 'where ';
                    updateModel.clause.forEach((clue) => {
                        if (typeof clue.value === 'string') {
                            query += `${clue.key}='${clue.value}'`
                        } else {
                            query += `${clue.key}=${clue.value}`
                        }
                        if (clue.clause) {
                            query += ` ${clue.clause} `
                        } else {
                            query += ';'
                        }
                    })
                }

                // console.log(query);

                queries += query;
            })

            console.log(queries);


        } catch (error) {
            console.log(error);
        }

        return queries;
    }

    async insertData(values) {
        let queries = this.prepareInsertQueries(values);
        try {
            let result = await this.pool.query(queries);
            // console.log(result);
            if (!result) {
                return this.sendResult(400, 'something wrong');
            }

            let id = '';
            if (result.rows) {
                id = result.rows[0];
            }

            return this.sendResult(200, 'successfully added!', `${result.rowCount || result.length} row inserted!`, id);
        } catch (error) {
            response.status = 500;
            response.info = "Internal error";
            console.log({ status: 500, error: error });
            return response;
        }
    }

    async fetchRows(entity, columns, clause) {

        let colums = '*';

        try {

            if (columns && columns.length > 0) {
                colums = columns.join(',')
            }

            let query = `select ${colums} from ${entity} `

            if (clause && clause.length > 0) {
                // console.log(clause);
                query += 'where ';

                clause.forEach((clue) => {
                    if (typeof clue.value === 'string') {
                        query += `${clue.key}='${clue.value}'`
                    } else {
                        query += `${clue.key}=${clue.value}`
                    }
                    if (clue.clause) {
                        query += ` ${clue.clause} `
                    }
                })
            }

            let res = await this.pool.query(query)

            if (!res || !res.rowCount < 0) {
                return this.sendResult(400, 'Failed to fetch!');
            }
            return this.sendResult(200, 'success', res.rows);
        } catch (error) {
            console.log(error);
        } finally {

        }
        return response;
    }

    async updateRows(updateModels) {

        let queries = this.prepareUpdateQueries(updateModels);
        // console.log(queries);
        try {
            let result = await this.pool.query(queries);
            // console.log(result.rowCount);
            if (result) {
                return this.sendResult(200, 'successfully updated!', `${result.rowCount || result.length} row updated!`);
            }
        } catch (error) {
            console.log(error);
        }
        return response;
    }

    async deleteRows(entity, clauses, isAll = false) {
        try {
            let query = `delete from ${entity}`;

            if (isAll) {
                query += ';';
            } else if (clauses && clauses.length > 0) {
                query += ' where ';
                clauses.forEach((clause) => {
                    if (typeof clause.value === 'string') {
                        query += `${clause.key}='${clause.value}'`
                    } else {
                        query += `${clause.key}=${clause.value}`
                    }
                    if (clause.clause) {
                        query += ` ${clause.clause} `
                    }
                })
            }

            console.log(query);

            let result = await this.pool.query(query)

            if (!result || !result.rowCount < 0) {
                return this.sendResult(400, 'Failed to delete!')
            }

            console.log(result.rows.length);

            return this.sendResult(200, 'successfully deleted!', `${result.rowCount} row deleted!`)

        } catch (error) {
            console.log(error);
            response.status = 400;
            response.info = 'Failde to delete!';
        }
        return response;
    }


    async executeWithValues(query, values) {
        // console.log(query,values);
        let response = {};
        try {
            let result = await this.pool.query(query, values);
            if (result && result.rows) {
                return { data: result.rows, status: 200 };
            }

            response.status = 400;
            response.info = "Failed to fetch";

        } catch (error) {
            console.log(error);
            response.status = 500;
            response.info = "Something went wrong!";
        }
        return response;
    }

    async execute(query) {
        let response = {};
        try {
            let result = await this.pool.query(query);
            // console.log(result);
            if (result && result.rows) {
                return { data: result.rows };
            }

            response.status = 400;
            response.info = "Failed to fetch";

        } catch (error) {
            console.log(error);
            response.status = 500;
            response.info = "Something went wrong!";
        }
        return response;
    }

    async executeNow(query) {
        try {

            const result = await this.pool.query(query);
            // console.log(result);

            return result;
        } catch (error) {
            return error;
        }

    }

    sendResult(status, info, data, id) {
        const response = { status, info, data, id };
        return response;
    }

}


const pgClient = new DbConfig();
module.exports = {
    pgClient, mapconfigs
}


