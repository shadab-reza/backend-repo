const { chatService } =require('../services/ChatService')

class ChatController {

    startChat(req , res ) {

        chatService.startChat('=require(user controller' + req);
        res.send('chat started success')
    }

    addMessage(req , res ) {

        let status = chatService.addMessage(req.body);
        res.send(status)
    }

    getMessages(req , res ) {

        res.send(chatService.startChat(req.body))
    }
}

const chatController = new ChatController();
module.exports={
    chatController
}