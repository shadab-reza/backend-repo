
const { pgClient } = require("../config/DBConfig");
const encrypt = require("../config/Encrypt");
const entity = 'user_task';
const {userService}= require('./UserService');
class TaskService {

    Tasks = []
    // TaskTasks:Array<any>=[]


    constructor() {
        this.columnsBodyKey = this.getColumns();
        this.colums = Array.from(this.columnsBodyKey.keys());
    }


    async addTask(data = []) {
        // console.log(data);

        try {
            //[{ entity: entity, columnVal: dataMap }]
            let dataArray = [];
            data.forEach(item => {
                let datValue = {
                    entity: entity,
                    columnVal: this.getDataMap(item)
                };
                dataArray.push(datValue);
            });

            // console.log(dataArray);

            let result = await pgClient.insertData(dataArray);
            // console.log(result);
            if (result.status !== 200) {
                return result;
            }
            return result;
        } catch (error) {
            console.log(error);
        }
        return { status: 400, info: 'bad request' };
    }

    async getTasks(data) {
        let response = {},result;
        try {

          const { userid, page,size:limit } = data;
          const offset= ((page - 1) * limit) || 0;

          const admin=await userService.isAdminUser(data);
        
          const querybyuser=`SELECT * FROM ${entity} WHERE user_id=$1 ORDER BY task_id DESC LIMIT $2 OFFSET $3`;
          const queryall=`SELECT * FROM ${entity} ORDER BY task_id DESC LIMIT $1 OFFSET $2`;
          if(admin.isadmin){            
            const total = await pgClient.execute(`select count(*) as total from ${entity}`);
            result = await pgClient.executeWithValues(queryall, [limit,offset]);
            result.total=total.data[0].total;
          }else{
            const total = await pgClient.executeWithValues(`select count(*) as total from ${entity} where user_id=$1`,[userid]);
            result = await pgClient.executeWithValues(querybyuser, [userid,limit,offset]);
            result.total=total.data[0].total;
          }

            if (result.data) {
                response.status = result.status;
                response.data = result.data;
                response.total=parseInt(result.total);
            }

        } catch (error) {
            console.log(error);
            response.status = 400;
            response.info = 'Bad Request!'
        }
        return response;
    }

    async updateTask(data = []) {
        // console.log(data);
        try {
            //[{ entity: entity, columnVal: dataMap, clause: clauses }]
            let dataArray = [];
            data.forEach(item => {
                let taskId=item.taskId;
                delete item.taskId;
                let datValue = {
                    entity: entity,
                    clause:this.getClauses(taskId),
                    // delete item.taskId;
                    columnVal: this.getDataMap(item),
                };
                dataArray.push(datValue);
            });

            // console.log(dataArray);
            // dataMap.delete(this.colums[0]);
            let result = await pgClient.updateRows(dataArray);
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

    async updateTaskStatus(data) {
        // console.log(data);
        try {
            let taskId=data.taskId;
            delete data.taskId;
            let dataMap=this.getDataMap(data);
            let clauses=this.getClauses(taskId);

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

    async deleteTask(data) {
        let response = {};
        try {
            let all = false;
            let clauses = this.getClauses(data.taskId);
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

    getClauses(taskId) {
        let clauses = [];
        let clause = { key: this.colums[0], value: taskId };
        clauses.push(clause);
        return clauses;
    }

    getColumns() {

        //key as column , value as payload key
        const keyvalueJson = {
            'task_id': 'taskId',
            'task_detail': 'task',
            'task_duration': 'duration',
            'task_status': 'status',
            'user_id': 'userId',
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

const taskService = new TaskService()

module.exports = {
    taskService
}