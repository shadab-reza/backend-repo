
const { pgClient } = require("../config/DBConfig");
const entity = 'branch_tbl';


class BranchService {


    constructor() {
        this.columns = this.getColumns();
    }

    async addbranch(data) {
        console.log(data);
        try {
            let dataMap = this.getDataMap(data);
            let result = await pgClient.insertData([{ entity: entity, columnVal: dataMap }]);
            if (result.status !== 200) {
                return { status: 'something wrong' }
            }
            return result;
        } catch (error) {
            console.log(error);
        }

        return {status:400,info:'bad request'};
    }

    async getbranchs(data) {
        let response = {};
        try {

            let result = await pgClient.fetchRows(entity, [], []);
            // console.log(result.data);
            if (result.data) {
                let rows = result.data;
                // console.log(rows[0]);
                // rows=rows.map(row=>{})
                response.status= 200;
                response.data=rows 
            }
            
        } catch (error) {
            console.log(error);
            response.status= 400;
            response.info='Bad Request!' 
        }
        return response;
    }

    async updatebranch(data) {
        try {
            let dataMap = this.getDataMap(data);
            let clauses = this.getClauses(data)
            let result = await pgClient.updateRows([{ entity: entity, columnVal: dataMap, clause: clauses }]);
            console.log(result);

            if (result.status !== 200) {
                return { status: 'something wrong' }
            }
            return result;
        } catch (error) {
            console.log(error);
        }

        return {status:400,info:'something wrong'};
    }

    async deleteBranch(data) {
        let response={};
        try {
            let all = data.all|false;
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
        dataMap.set(this.columns[1], data.branchname);
        return dataMap;
    }

    getClauses(data) {
        let clauses = [];
        let clause = { key: this.columns[0], value: data.branchid };
        clauses.push(clause);
        return clauses;
    }

    getColumns() {
        return ['branch_id', 'branch_name'];
    }
}

const branchService = new BranchService()

module.exports = {
    branchService
}