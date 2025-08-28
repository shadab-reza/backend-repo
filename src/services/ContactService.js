
const { pgClient } =require("../config/DBConfig");
const encrypt =require("../config/Encrypt");
const { jsonToken } =require("../utils/TokenService");
const entity = 'branch';
class UserService {

    users= []
    // userContacts:Array<any>=[]


    constructor() {
        // this.addContact({ name: 'user' })
    }

    async loginService(data) {
        let userExist = await pgClient.fetchRows(entity, [], [{ key: 'id', value: parseInt(data.userid) }])
        // console.log(userExist.rows.length);
        let info='success';
        try {
            if (userExist.rows.length === 1) {
                let isValid = await encrypt.comparePassword(data.password, userExist.rows[0].password);
                // console.log(res);
                if (isValid) {
                    let token = jsonToken.generateToken({ user: data.userid.toString() })
                    // console.log(token);                
                    return { status : 200, info,token }
                }
            }
        } catch (error) {
            console.log(error);
        }
        return { status: 400,info:'failed' }
    }

    async addContact(data) {
        console.log( data);
        try {
            let encryptPwd = await encrypt.cryptPassword(data.password);
            let dataMap = new Map();
            dataMap.set('name', data.name);
            dataMap.set('salary', data.salary || 1000)
            dataMap.set('password', encryptPwd);
            let result = await pgClient.insertData([{ entity: entity, columnVal: dataMap }]);
            if (result.status !== 'success') {
                return { status: 'something wrong' }
            }
            return { status: 200 };
        } catch (error) {
            console.log(error);
        }
    }

    async getContacts(data) {
        let users = await pgClient.fetchRows(entity, [], [])
        // console.log(userExist.rows.length);

        try {

            if (users.rows.length > 0) {
                return { status: 'success', data: users.rows }
            }

        } catch (error) {
            console.log(error);
        }
        return { status: 'failed' }
    }

    getUserContacts(data) {
        return this.users.filter(user => user.userID === data.userID);
    }

    async updateUser(data){
        try {
            let dataMap = new Map();
            dataMap.set('name', data.name);
            dataMap.set('salary', data.salary)
            let result = await pgClient.updateRows([{ entity: entity, columnVal: dataMap,clause:[{key:'id',value:data.userid}] }]);
            console.log(result);
            
            if (result.status !== 'success') {
                return { status: 'something wrong' }
            }
            return { status: 'successfully updated!' };
        } catch (error) {
            console.log(error);
        }
    }
}

const userService = new UserService()

module.exports={
    userService
}