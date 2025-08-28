
class ChatService {
    messages = [];

    startChat(arg0) {
    }

    addMessage(message) {
        let mid = this.messages.length + 1;
        this.messages.push({
            messageid: mid,
            to: message.to,
            from: message.from,
            message: message.message
        })
        return { status: 200 }
    }

    getMessages(user) {
        return this.messages.filter(m => m.to == user || m.from == user);
    }


}

const chatService = new ChatService()

module.exports={
    chatService
}