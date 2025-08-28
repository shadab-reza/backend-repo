const { branchService } =require('../services/branchservice');

class BranchController {


    async getAccountTypes(req , res ) {
        let accountType = await branchService.getbranchs();
        // console.log(accountType);
        res.status(accountType.status).send(accountType.data);
    }

    async addAccountType(req,res) {
        // console.log('gggggggg'+req.body);        
        let status = await branchService.addbranch(req.body);
        res.send(status);
    }

    async updateAccountType(req , res ) {
        console.log(req.body);        
        let status = await branchService.updatebranch(req.body);
        // console.log(status);
        res.send(status);
    }

    async deleteAccountType(req , res ) {
        let result = await branchService.deleteBranch(req.body);
        // console.log(result);
        res.status(result.status).send(result);
    }
}

const branchController = new BranchController();

module.exports={
    branchController
}