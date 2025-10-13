const express = require('express');
const { txnController } = require('../controllers/TxnController');
const {authService} = require('../services/Auth')

const txnRoutes = express.Router();

// userRoutes.use(authService.authenticate)

txnRoutes.get('/txn',txnController.getTxns);
txnRoutes.post('/txn',txnController.addTxn);
txnRoutes.post('/txn/verify',txnController.verifyTxn);
txnRoutes.delete('/txn',txnController.deleteTxn);

module.exports= {
    txnRoutes
}