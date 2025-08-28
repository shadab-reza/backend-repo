const { workReportService } =require('../services/WorkReportService');

class WorkReportController {

    async addWorkReport(req , res ) {
        let status = await workReportService.addWorkReport(req.body);
        // console.log(status);        
        res.send(status);
    }

    async updateWorkReport(req , res ) {
        let status = await workReportService.updateWorkReport(req.body);
        // console.log(status);        
        res.send(status);
    }
    
    async getWorkReports(req , res ) {
        let response = await workReportService.getWorkReports({userid:req.query.userid, page: req.query.page||1, size: req.query.size||10});
        // console.log(response);
        res.status(response.status).send(response);
    }

    async deleteWorkReport(req , res ) {
        let result = await workReportService.deleteWorkReport(req.body);
        // console.log(result);
        res.status(result.status).send(result);
    }
}

const workReportController = new WorkReportController();

module.exports={
    workReportController
}