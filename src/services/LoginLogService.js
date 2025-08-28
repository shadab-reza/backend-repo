'use-strict'

const { pgClient } = require("../config/DBConfig");
const { userService } =require('../services/UserService');


const entity = 'user_login_out_log';

class LoginLogService {

	constructor() {
		this.columnsBodyKey = this.getColumns();
		this.colums = Array.from(this.columnsBodyKey.keys());
	}

	async addLoginLog(data) {
		try {

			let dataMap = this.getDataMap(data);
			dataMap.set("login_geoloc",JSON.stringify({"action":"LOGIN","longitude":data.longitude,"latitude":data.latitude}))
			let todayLoginExist = await pgClient.executeWithValues(`SELECT user_id,login_ts FROM ${entity} WHERE user_id = $1 AND to_char(login_ts, 'YYYY-MM-DD') = to_char(CURRENT_DATE, 'YYYY-MM-DD')`, [data.userId]);
			
			if (todayLoginExist.data.length > 0) {
				return { status: 400, info: 'today login already exist' };
			}
			let result = await pgClient.insertData([{ entity: entity, columnVal: dataMap }]);
			if (result.status !== 200) {
				return { status: 400, info: 'something wrong' };
			}
			return result;

		} catch (error) {
			console.log(error);
		}
		return { status: 400, info: 'bad request' };
	}

	async addLogoutLog(data) {
		try {

			let todayLoginExist = await pgClient.executeWithValues(`SELECT logg_id,user_id,login_ts FROM ${entity} WHERE user_id = $1 AND to_char(login_ts, 'YYYY-MM-DD') = to_char(CURRENT_DATE, 'YYYY-MM-DD')`, [data.userId]);
			if (todayLoginExist.data?.length == 0) {
				return { status: 400, info: 'Not logged yet,login first' };
			}
			
		   let updateLog = await pgClient.executeWithValues(`update user_login_out_log set logout_ts=NOW(),logout_geoloc=$1 where logg_id=$2`,
			[JSON.stringify({"action":"LOGOUT","longitude":data.longitude,"latitude":data.latitude}),todayLoginExist.data[0].logg_id]);
		   
			if (!updateLog) {
				return { status: 400, info: 'something wrong' };
			}


			return {'message':"success logout",status:200};
		} catch (error) {
			console.log(error);
		}
		return { status: 400, info: 'bad request' };
	}

	async getLoginLogs(params) {
		let response = {};
		try {

			const {page,size:limit}=params;
			const offset = (page - 1) * limit;

			const query = `select logg_id, user_id, login_geoloc,logout_geoloc, to_char(login_ts, 'YYYY-MM-DD HH24:MI') as logints,to_char(logout_ts, 'YYYY-MM-DD HH24:MI') as logoutts from ${entity} ORDER BY login_ts DESC LIMIT $1 OFFSET $2`;
			const querybyuser = `select logg_id, user_id, login_geoloc,logout_geoloc, to_char(login_ts, 'YYYY-MM-DD HH24:MI') as logints,to_char(logout_ts, 'YYYY-MM-DD HH24:MI') as logoutts from ${entity} where user_id=$1 ORDER BY login_ts DESC LIMIT $2 OFFSET $3`;
			const user=await userService.isAdminUser({userid:params.userid});
			let result;
			
			if(user.isadmin){
			result = await pgClient.executeWithValues(query,[limit, offset]);
			const total=await pgClient.execute(`select count(*) as total from ${entity}`);
			result.total=parseInt(total.data[0].total);

			}else{
			result = await pgClient.executeWithValues(querybyuser,[parseInt(params.userid), limit, offset]);
			const total=await pgClient.executeWithValues(`select count(*) as total from ${entity} where user_id=$1`,[parseInt(params.userid)]);
			result.total=parseInt(total.data[0].total);
			}

			if (result.data) {
				response.status = 200;
				response.data = result.data;
				response.total= result.total;
			} else {
				response = result;
			}
		} catch (error) {
			console.log(error);
			response.status = 400;
			response.info = 'Bad Request!';
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

	getColumns() {
		const keyvalueJson = {
			'user_id': 'userId'
			// 'login_geoloc':'longitude',
			// 'login_geoloc':"latitude"
			// 'log_in_ts': 'logInTs',
			// 'log_out_ts': 'logOutTs',
		};
		const mappedKey = new Map();
		Object.entries(keyvalueJson).forEach(([key, value]) => {
			mappedKey.set(key, value);
		});
		return mappedKey;
	}
}

const loginLogService = new LoginLogService();

module.exports = {
	loginLogService
}



