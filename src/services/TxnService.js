
const { pgClient } = require("../config/DBConfig");
const encrypt = require("../config/Encrypt");
const { jsonToken } = require("../utils/TokenService");
const entity = 'transactions';
const { userService } = require('./UserService');
class TxnService {


    constructor() {
        this.columnsBodyKey = this.getColumns();
        this.colums = Array.from(this.columnsBodyKey.keys());
    }


    async addTxn(data) {
        // console.log(data);
        try {

            // data.roles = JSON.stringify(data.roles);
            let dataMap = this.getDataMap(data);
            // console.log(dataMap);
            let result = await pgClient.insertData([{ entity: entity, columnVal: dataMap }]);
            if (result.status !== 200) {
                return { status: 'something wrong' }
            }
            return result;
        } catch (error) {
            console.log(error);
        }

        return { status: 400, info: 'bad request' };
    }

    async getTxns(data) {
        let response = {}, result;
        try {


            const { userid, page, size } = data;
            const offset = (page - 1) * size;
            const res = await userService.isAdminUser(data);

            if (res.isadmin) {
                const query = `select t.txn_id,t.created_by,to_char(t.created_at, 'YYYY-MM-DD HH24:MI') as created_at,t.to_from,t.txn_type,t.amount,t.location,t.remarks,
            t.is_verified,a.account_type from ${entity} t
            join account_type a on a.account_type_id = t.account_id
            order by t.created_at asc limit $1 offset $2;`;

                const [result1, result2] = await Promise.all([pgClient.executeWithValues(query, [size, offset]), pgClient.execute(`select count(*) as total from ${entity}`)]);

                result = result1;
                result.total = parseInt(result2.data[0].total);

            } else {
                const query = `select t.txn_id,t.created_by,to_char(t.created_at, 'YYYY-MM-DD HH24:MI') as created_at,t.to_from,t.txn_type,t.amount,t.location,t.remarks,
            t.is_verified,a.account_type from ${entity} t
            join account_type a on a.account_type_id = t.account_id where t.created_by=$1
            order by t.created_at asc limit $2 offset $3;`;

                result = await pgClient.executeWithValues(query, [userid, size, offset]);
            }

            if (result.data) {
                response.status = result.status;
                response.data = result.data;
                response.total = result.total;
            } else {
                response = result;
            }

            // console.log(result);
            // console.log(response);

        } catch (error) {
            console.log(error);
            response.status = 400;
            response.info = 'Bad Request!'
        }

        return response;
    }

    async verifyTxn(data = {}) {
        let response = {}, result;
        try {

            const res = await userService.isAdminUser({ userid: data.userid });
            const txnIds = data.txnIds || [];
            
            if (res.isadmin) {
                const query = `update ${entity} set is_verified=true where txn_id=any($1::int[]);`;
                result = await pgClient.executeWithValues(query, [txnIds]);
            }

            if (result.data) {
                response.status = result.status;
                response.data = result.data;
                response.total = result.total;
            } else {
                response = result;
            }

            // console.log(result);
            // console.log(response);

        } catch (error) {
            console.log(error);
            response.status = 400;
            response.info = 'Bad Request!'
        }

        return response;

    }


    async deleteTxn(data) {
        let response = {};
        try {
            let all = false;
            let clauses = this.getClauses(data);
            let result = await pgClient.deleteRows(entity, clauses, all);
            // console.log(result);

            return result;
        } catch (error) {
            console.log(error);
        }
        return response;
    }

    getDataMap(data) {
        let dataMap = new Map();
        this.columnsBodyKey.forEach((value, key) => {
            if (data[value]) {
                dataMap.set(key, data[value]);
            }
        });

        return dataMap;
    }

    getClauses(data) {
        let clauses = [];
        let clause = { key: this.colums[0], value: data.txnId };
        clauses.push(clause);
        return clauses;
    }

    getColumns() {

        //key as column , value as payload key
        const keyvalueJson = {
            "txn_id": "txnId",
            "created_by": "createdBy",
            "txn_type": "txnType",
            "amount": "amount",
            "account_id": "accountId",
            "to_from": "toFrom",
            "location": "location",
            "remarks": "remarks"
        };

        const mappedKey = new Map();

        Object.entries(keyvalueJson).forEach(([key, value]) => {
            // console.log(`"${key}": "${value}"`);
            mappedKey.set(key, value);
        });

        return mappedKey;
    }


}

const txnService = new TxnService()

module.exports = {
    txnService
}