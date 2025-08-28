const  { App } =require("./App");
const dotenv =require("dotenv");
const { createServer } =require('http');
const { ConfigSocket } =require("./Socket");
dotenv.config();

const server=createServer(App);
// const server1=createServer(App);
// const server2=createServer(App);
// const server3=createServer(App);
// new ConfigSocket(server);

const port=process.env.PORT||3000;

server.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`);
});


// server1.listen(3001, () => {
//   console.log(`[server] Server is running at http://localhost:${port}`);
// });
// server2.listen(3002, () => {
//   console.log(`[server] Server is running at http://localhost:${port}`);
// });
// server3.listen(3003, () => {
//   console.log(`[server] Server is running at http://localhost:${port}`);
// });