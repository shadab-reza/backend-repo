const  { App } = require("./App");
const env = require("dotenv").config();
const { createServer } = require('http');
const {log}=require('./utils/loggerutil');

const server=createServer(App);

const port=process.env.PORT||3000;
const host=process.env.apphost;

server.listen(port,() => {
  log(`[server] Server is running at http://${host}:${port}`);
  console.log(`[server] Server is running at http://${host}:${port}`);
});


