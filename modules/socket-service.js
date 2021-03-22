const Server = require('socket.io'); //const io = require('socket.io')(http);

//working variables
let usersTyping = {};

//module
module.exports = function(http) {
  const io = new Server(http);

  io.on('connection', (socket) => {
    let username = 'A user';

    //connections
    socket.on('chat-user-enter', (data) => {
      username = JSON.parse(data).user;
      //console.log(`${username} connected`);

      socket.emit('chat-system-message', JSON.stringify({
        message: `Welcome ${username}!`
      }));

      socket.broadcast.emit('chat-system-message', JSON.stringify({
        message: `${username} has entered the chat.`
      }));
    });

    socket.on('disconnect', () => {
      //console.log(`${username} disconnected`);
      removeUserTyping(username);
      socket.broadcast.emit('chat-system-message', JSON.stringify({
        message: `${username} has left the chat.`
      }));
    });

    //messages
    socket.on('chat-user-message', (data) => {
      data = JSON.parse(data);
      io.emit('chat-user-message', JSON.stringify({
        user: username,
        message: data.message
      }));
    });

    //check if user is typing
    function addUserTyping() {
      usersTyping[username] = true;
      updateUserTypingList();
    }

    function removeUserTyping() {
      delete usersTyping[username];
      updateUserTypingList();
    }

    function updateUserTypingList() {
      io.emit('chat-user-typing', JSON.stringify(usersTyping));
    }

    socket.on('chat-user-typingstart', (data) => {
      addUserTyping();
    })

    socket.on('chat-user-typingend', (data) => {
      removeUserTyping();
    })
  });

}
