
const { pgClient } = require("../config/DBConfig");
const entity = 'work_report';
const {userService}= require('./UserService');

class WorkReportService {


    constructor() {
        this.columnsBodyKey = this.getColumns();
        this.colums = Array.from(this.columnsBodyKey.keys());
    }


    async addWorkReport(data) {
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

    async updateWorkReport(data) {
        console.log(data);
        try {

            let dataMap = this.getDataMap(data);
            let clauses = this.getClauses(data);
            // console.log(dataMap);
            let result = await pgClient.updateRows([{ entity: entity, columnVal: dataMap, clause: clauses }]);
            if (result.status !== 200) {
                return { status: 'something wrong' }
            }
            return result;
        } catch (error) {
            console.log(error);
        }

        return { status: 400, info: 'bad request' };
    }

    async getWorkReports(data) {
        let response = {},result;
        try {

          const { userid, page,size:limit } = data;
          const offset= ((page - 1) * limit) || 0;

          const admin=await userService.isAdminUser(data);
        
          const querybyuser=`SELECT * FROM ${entity} WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
          const queryall=`SELECT * FROM ${entity} ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
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
            } else {
                response = result;
            }
        } catch (error) {
            console.log(error);
            response.status = 400;
            response.info = 'Bad Request!'
        }
        return response;
    }


    async deleteWorkReport(data) {
        // console.log(data);
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
        let clause = { key: this.colums[0], value: data.reportId };
        clauses.push(clause);
        return clauses;
    }

    getColumns() {

        //key as column , value as payload key
        const keyvalueJson = {
            "report_id": "reportId",
            "report_detail": "reportDetail",
            "user_id": "userId"
        };

        const mappedKey = new Map();

        Object.entries(keyvalueJson).forEach(([key, value]) => {
            // console.log(`"${key}": "${value}"`);
            mappedKey.set(key, value);
        });

        return mappedKey;
    }


}

const workReportService = new WorkReportService()

module.exports = {
    workReportService
}