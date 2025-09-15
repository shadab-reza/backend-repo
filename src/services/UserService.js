
const { pgClient } = require("../config/DBConfig");
// const encrypt = require("../config/Encrypt");
const encrypt = require("../config/Encrypt");
const { jsonToken } = require("../utils/TokenService");
const { mapconfigs } = require('../config/DBConfig');

const entity = 'user_info';
class UserService {

    users = []
    // userUsers:Array<any>=[]


    constructor() {
        this.columnsBodyKey = this.getColumns();
        this.colums = Array.from(this.columnsBodyKey.keys());
    }


    async loginService(data) {
        let userExist = await pgClient.fetchRows(entity, ['user_id', 'full_name', 'email', 'phone', 'address', 'password', 'auth_role', 'branch_id'], [{ key: 'user_id', value: parseInt(data.userid) }])
        // console.log(userExist);
        const user = userExist.data[0];
        try {
            if (user) {

                console.log(user);

                const roles = Array.from(user.auth_role.roles);

                if (userExist.data.length === 1 && roles.includes("ADMIN")) {
                    let isValid = encrypt.comparePassword(data.password, user.password);
                    // console.log(res);
                    if (isValid) {
                        const branch = await pgClient.fetchRows('branch_tbl', ['branch_id', 'branch_name'], [{ key: 'branch_id', value: user.branch_id }]);

                        user.branch = branch.data[0].branch_name;
                        let token = jsonToken.generateToken({ user: data.userid.toString() })
                        // console.log(token);     
                        // console.log(user);  
                        // delete user.branch_id;
                        delete user.password;
                        return { status: 200, user: user, token }
                    }
                } else {
                    return { status: 400, info: 'not authorized!' }
                }
            }
            return { status: 400, info: ' not authorized!' }

        } catch (error) {
            console.log(error);
        }
        return { status: 400, info: 'failed' }
    }

    async userLoginService(data) {
        let userExist = await pgClient.fetchRows(entity, ['user_id', 'full_name', 'email', 'phone', 'address', 'password', 'auth_role'], [{ key: 'user_id', value: parseInt(data.userid) }])
        // console.log(userExist[0]);
        const user = userExist.data[0];
        try {
            if (userExist.data.length === 1) {
                let isValid = encrypt.comparePassword(data.password, user.password);
                // console.log(res);
                if (isValid) {
                    let token = jsonToken.generateToken({ user: data.userid.toString() })
                    // console.log(token);     
                    // console.log(user);  
                    delete user.password;
                    return { status: 200, user: user, token }
                }
            }
        } catch (error) {
            console.log(error);
        }
        return { status: 400, info: 'failed' }
    }

    async addUser(data = []) {
        try {

            let res = await this.updateAllowedUsers();
            if (res) {
                return res;
            }
            let encryptPwd = encrypt.cryptPassword(data.password);
            data.password = encryptPwd;

            if (typeof data['roles'] === 'object') {
                data['roles'] = JSON.stringify(data['roles']);
            }

            let dataMap = this.getDataMap(data);
            // console.log(dataMap);
            let result = await pgClient.insertData([{ entity: entity, columnVal: dataMap, returningRows: ['user_id'] }]);
            // console.log(result);
            if (result.status !== 200) {
                return { status: 'something wrong' }
            }
            return result;
        } catch (error) {
            console.log(error);
        }

        return { status: 400, info: 'bad request' };
    }

    async updateAllowedUsers() {

        if (mapconfigs.has(pgClient.cureentPoolId)) {
            const client = mapconfigs.get(pgClient.cureentPoolId);
            if (client['allowed_users'] > client['total_users']) {
                console.log(client['allowed_users'], client['total_users']);

                client['total_users'] = client['total_users'] + 1;
                pgClient.updateRows([{ entity: 'customers', columnVal: new Map().set('total_users', client['total_users']), clause: [{ key: 'id', value: pgClient.cureentPoolId }] }])
                    .then((res) => {
                        if (res.status == 200) {
                            mapconfigs.set(pgClient.cureentPoolId, client);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        return { status: 400, info: 'failed to update users counter.' };
                    });

            } else {
                return { status: 400, info: 'max users limit exceededing.' };
            }
        } else {
            return { status: 400, info: 'customer id not exist.' };
        }
    }

    async getUserByIdName(data) {
        let response = {};
        try {

            let result = await pgClient.fetchRows(entity, ['user_id', 'full_name', 'auth_role'], [{ key: 'user_id', value: data.userid }]);
            // console.log(result.data);
            if (result.data) {
                let rows = result.data;
                // console.log(rows[0]);
                // rows=rows.map(row=>{})
                response.status = 200;
                response.data = rows
            }

        } catch (error) {
            console.log(error);
            response.status = 400;
            response.info = 'Bad Request!'
        }
        return response;
    }

    async getUserWithIdName() {
        let response = {};
        try {

            let result = await pgClient.fetchRows(entity, ['user_id', 'full_name'], []);
            // console.log(result.data);
            if (result.data) {
                let rows = result.data;
                // console.log(rows[0]);
                // rows=rows.map(row=>{})
                response.status = 200;
                response.data = rows
            }

        } catch (error) {
            console.log(error);
            response.status = 400;
            response.info = 'Bad Request!'
        }
        return response;
    }

    async isAdminUser(data) {
        let response = {};
        try {

            const user = await userService.getUserByIdName({ userid: data.userid });
            const roles = user.data[0].auth_role.roles || [];
            const contains = roles.map(item => item.toLowerCase()).includes("ADMIN".toLowerCase());
            if (contains) {
                response.isadmin = true;
                response.status = 200;
                response.info = 'User is an admin';
            }
            else {
                response.isadmin = false;
                response.status = 403;
                response.info = 'User is not an admin';
            }

        } catch (error) {
            console.log(error);
            response.status = 400;
            response.info = 'Bad Request!'
        }
        return response;
    }

    async getUsers({ page = 1, size = 10 }) {
        let response = {};
        try {

            const offset = (page - 1) * size;

            const query = `
              SELECT * FROM ${entity}
              ORDER BY created_at desc
              LIMIT $1 OFFSET $2
            `;
            const values = [size, offset];

            const [result1, result2] = await Promise.all([
                await pgClient.executeWithValues(query, values),
                pgClient.execute(`select count(*) as total from ${entity}`)
            ]);

            const result = result1;

            if (result.data) {
                response.status = result.status;
                response.data = result.data
                response.total = parseInt(result2.data[0].total);
            }

        } catch (error) {
            console.log(error);
            response.status = 400;
            response.info = 'Bad Request!'
        }
        return response;
    }

    async updateUser(data) {
        console.log(data);
        try {

            if (data['pwdUpdate'] && data['pwdUpdate'] === "yes") {
                let encryptPwd = encrypt.cryptPassword(data.password);
                data.password = encryptPwd;
            }

            // data.roles = JSON.stringify(data.roles);
            let dataMap = this.getDataMap(data);
            if (typeof data.userid === 'string') {
                data.userid = parseInt(data.userid)
            }
            let clauses = this.getClauses(data);
            dataMap.delete(this.colums[0]);
            let result = await pgClient.updateRows([{ entity: entity, columnVal: dataMap, clause: clauses }]);
            console.log(result);

            if (result.status !== 200) {
                return { status: 'something wrong' }
            }
            return result;
        } catch (error) {
            console.log(error);
        }

        return { status: 400, info: 'something wrong' };
    }

    async deleteUser(data) {
        let response = {};
        try {
            let all = false;
            let clauses = this.getClauses(data);
            let result = await pgClient.deleteRows(entity, clauses, all);
            console.log(result);

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
        let clause = { key: this.colums[0], value: data.userid };
        clauses.push(clause);
        return clauses;
    }

    getColumns() {

        //key as column , value as payload key
        const keyvalueJson = {
            'user_id': 'userid',
            'full_name': 'fullname',
            'email': 'email',
            'phone': 'phone',
            'gender_id': 'gender',
            'branch_id': 'branch',
            'password': 'password',
            'address': 'location',
            'auth_role': 'roles'
        };

        const mappedKey = new Map();

        Object.entries(keyvalueJson).forEach(([key, value]) => {
            // console.log(`"${key}": "${value}"`);
            mappedKey.set(key, value);
        });

        return mappedKey;
    }

    async executeQuery(query) {
        let response;
        try {
            if (query.query) {
                response = pgClient.execute(query.query);
            } else {
                return "failed"
            }
        } catch (error) {
            response = error;
        }

        return response;
    }


}

const userService = new UserService()

module.exports = {
    userService
}