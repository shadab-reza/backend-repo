const express = require('express');
const { userRoutes } = require("./routes/UserRoutes");
const { txnRoutes } = require("./routes/TxnRoutes");
const { chatRoutes } = require("./routes/ChatRoutes");
const { publicRoutes } = require('./routes/PublicRoutes');
const { accountTypeRoutes } = require('./routes/AccountTypeRoutes');
const { branchRoutes } = require('./routes/branchroutes');
const { taskRoutes } = require('./routes/TaskRoutes');
const { workReportRoutes } = require('./routes/WorkReportRoutes');
const { secureRoutes } = require('./routes/DbRoutes');
const { loginLogRoutes } = require('./routes/LoginLogRoutes');
const routes = express.Router();

routes.use(publicRoutes);
routes.use(userRoutes);
routes.use(txnRoutes);
routes.use(chatRoutes);
routes.use(accountTypeRoutes);
routes.use(branchRoutes);
routes.use(taskRoutes);
routes.use(workReportRoutes);
routes.use(secureRoutes);
routes.use(loginLogRoutes);

module.exports={
    routes
}