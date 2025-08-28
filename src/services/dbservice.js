'use-strict'

const pgClient = require('../config/DBConfig');

class PgClient {

    constructor() { }

    async execute(query) {
        return await pgClient.pgClient.executeNow(query);
    }
}

module.exports = new PgClient()

