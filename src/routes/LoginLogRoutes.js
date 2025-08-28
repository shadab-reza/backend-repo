const express = require('express');
const { loginLogController } = require('../controllers/LoginLogController');

const loginLogRoutes = express.Router();

// public endpoints to record login/logout
loginLogRoutes.post('/log/login', loginLogController.logLogin);
loginLogRoutes.post('/log/logout', loginLogController.logLogout);

// history endpoint (can be used with optional ?userid= or admin access)
loginLogRoutes.get('/log/history', loginLogController.getLogs);

module.exports = {
	loginLogRoutes
}



