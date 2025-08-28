const { Server } = require("socket.io");
const { sessionStore } = require('./utils/Session')

class ConfigSocket {

  chatSpace = '/chat';
  socketServer;
  users = new Map();
  userlist = new Set();

  constructor(appServer) {
    this.socketServer = new Server(appServer);
    // this.startSocketServerv1();
    this.chatServer();
    // this.users=userService.getContacts('');
  }

  chatServer() {
    const chatSpaceSocket = this.socketServer.of(this.chatSpace);

    //https://socket.io/docs/v4/tutorial/api-overview

    this.socketServer.use((socket, next) => {
      const sessionID = socket.handshake.auth.sessionID;
      if (sessionID) {
        // find existing session
        const session = sessionStore.findSession(sessionID);
        if (session) {
          socket.sessionID = sessionID;
          socket.userID = session.userID;
          socket.username = session.username;
          return next();
        }
      }
      const username = socket.handshake.auth.username;
      console.log(username);
      if (!username) {
        return next(new Error("invalid username"));
      }
      // create new session
      // socket.sessionID = randomId();
      // socket.userID = randomId();
      socket.username = username;
      next();
    });

    this.socketServer.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        //   this.usernameAlreadySelected = false;
      }
    });


  

    chatSpaceSocket.on("connection", (chatSocket) => {
      console.log("A user connected " + chatSocket.id);

      if (this.users.has(chatSocket.id)) {
        let value = this.users.get(chatSocket.id);
        this.users.set(chatSocket.id, value);
      } else {
        this.users.set(chatSocket.id, {
          userid: chatSocket.id,
          loggedintime: new Date().getTime(),
          messages: []
        })
      }

      // this.userlist.add(chatSocket.id);

      chatSocket.emit("users", Array.from(this.users.values()));
      // chatSocket.emit("users", Array.from(this.userlist));

      // chatSpaceSocket.emit("loggedin", chatSocket.id);

      chatSocket.broadcast.emit("loggedoff", {
        userID: chatSocket.id,
        username: chatSocket.username,
      });


      chatSocket.on("chat", (data) => {
        console.log('server listner ' + JSON.stringify(data));
        // console.log(data.to);

        chatSocket.to(data.to).emit("chat", data);
      });

      chatSocket.on('connect', () => {
        console.log('server connect event');

      })

      chatSocket.on("disconnect", () => {
        console.log('server disconnect event');

      });

    });
  }

  startSocketServerv1() {
    const chatSpaceSocket = this.socketServer.of(this.chatSpace);

    //https://socket.io/docs/v4/tutorial/api-overview

    this.socketServer.use((socket, next) => {

      const username = socket.handshake.auth.username;
      if (!username) {
        return next(new Error("invalid username"));
      }
      socket.username = username;
      next();
    });

    this.socketServer.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        //   this.usernameAlreadySelected = false;
      }
    });

    chatSpaceSocket.on("connection", (chatSocket) => {

      if (this.users.has(chatSocket.id)) {
        let value = this.users.get(chatSocket.id);
        this.users.set(chatSocket.id, value);
      } else {
        this.users.set(chatSocket.id, {
          userid: chatSocket.id,
          loggedintime: new Date().toLocale(),
          messages: []
        })
      }

      // this.userlist.add(chatSocket.id);

      chatSocket.emit("users", Array.from(this.users.values()));
      // chatSocket.emit("users", Array.from(this.userlist));

      chatSpaceSocket.emit("loggedin", chatSocket.id);

      chatSocket.broadcast.emit("loggedoff", {
        userID: chatSocket.id,
        username: chatSocket.username,
      });

      console.log("A user connected " + chatSocket.id);

      chatSocket.on("chat", (data) => {
        console.log('server listner ' + JSON.ify(data));
        // console.log(data.to);

        chatSocket.to(data.to).emit("chat", data);
      });

      chatSocket.on('connect', () => {
        console.log('server connect event');

      })

      chatSocket.on("disconnect", () => {
        console.log('server disconnect event');

      });

    });
  }

  socketWithNameSpace() {

  }
}

module.exports = {
  ConfigSocket
}