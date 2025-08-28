const express = require('express');
const { workReportController } = require('../controllers/WorkReportController');

const workReportRoutes = express.Router();


workReportRoutes.get('/work-report',workReportController.getWorkReports)
workReportRoutes.post('/work-report',workReportController.addWorkReport)
workReportRoutes.put('/work-report',workReportController.updateWorkReport)
workReportRoutes.delete('/work-report',workReportController.deleteWorkReport)

module.exports= {
    workReportRoutes
}