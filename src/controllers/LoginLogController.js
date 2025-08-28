const { loginLogService } = require('../services/LoginLogService');

class LoginLogController {

	async logLogin(req, res) {
		let userId = parseInt(req.body.userId);
		if (Number.isNaN(userId)) {
			return res.status(400).send({ status: 400, info: 'userId required' });
		}
		let result = await loginLogService.addLoginLog(req.body);
		res.status(result.status).send(result);
	}

	async logLogout(req, res) {
		let userId = parseInt(req.body.userId);
		if (Number.isNaN(userId)) {
			return res.status(400).send({ status: 400, info: 'userId required' });
		}
		let result = await loginLogService.addLogoutLog(req.body);
		res.status(result.status).send(result);
	}

	async getLogs(req, res) {
		let response = await loginLogService.getLoginLogs({...req.query, page:req.query.page || 1, size:req.query.size || 10});
		res.status(response.status).send(response);
	}
}

const loginLogController = new LoginLogController();

module.exports = {
	loginLogController
}



