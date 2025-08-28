const { accountTypeService } =require('../services/AccountTypeService');

class AccountTypeController {


    async getAccountTypes(req , res ) {
        let accountType = await accountTypeService.getAccountTypes();
        // console.log(accountType);
        res.status(accountType.status).send(accountType.data);
    }

    async addAccountType(req,res) {
        // console.log('gggggggg'+req.body);        
        let status = await accountTypeService.addAccountType(req.body);
        res.send(status);
    }

    async updateAccountType(req , res ) {
        console.log(req.body);        
        let status = await accountTypeService.updateAccountType(req.body);
        // console.log(status);
        res.send(status);
    }

    async deleteAccountType(req , res ) {
        let result = await accountTypeService.deleteAccountType(req.body);
        // console.log(result);
        res.status(result.status).send(result);
    }
}

const accountTypeController = new AccountTypeController();

module.exports={
    accountTypeController
}