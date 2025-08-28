const { txnService } =require('../services/TxnService');

class TxnController {

    async addTxn(req , res ) {
        let status = await txnService.addTxn(req.body);
        // console.log(status);        
        res.send(status);
    }
    
    async getTxns(req , res ) {
        let response = await txnService.getTxns({...req.query,page: req.query.page || 1,size: req.query.size || 10 });
        // console.log(response);
        res.status(response.status).send(response);
    }

    async deleteTxn(req , res ) {
        let result = await txnService.deleteTxn(req.body);
        // console.log(result);
        res.status(result.status).send(result);
    }
}

const txnController = new TxnController();

module.exports={
    txnController
}