const express =require('express');
const { chatController } =require('../controllers/ChatController');

 const chatRoutes = express.Router();

chatRoutes.get('/chat',chatController.startChat)
chatRoutes.get('/chat',(req,res)=>{
res.send({"msg":"running..."});
})

module.exports={
    chatRoutes
}