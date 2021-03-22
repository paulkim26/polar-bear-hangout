//globals
const socket = io();

//settings
const typingDelay = 1000;

let username = `user${pad(getRndInteger(1, 9999), 4)}` //randomly generate username
loginProcess.then(() => {
  if (user) {
    username = `${user.firstName} ${user.lastName.charAt(0)}`;
  }
  enterChat();
});

//working var
let isTyping = false;
let typingTimeout;

//functions
function emitSocket(type, obj) {
  socket.emit(type, JSON.stringify(obj));
}

function enterChat() {
  emitSocket('chat-user-enter', {user: username});
}

function addChatLog(text) {
  $('#chat-log').append(`<div>${text}</div>`);
}

function startTyping() {
  isTyping = true;
  emitSocket('chat-user-typingstart', {});
}

function stopTyping() {
  isTyping = false;
  emitSocket('chat-user-typingend', {});
}

//jQuery
$(function(){

  //
  $('#chat-form').on('submit', function(e){
    e.preventDefault();
    input = $(this).find('[name="message"]');
    const message = input.val();

    if (message) {
      stopTyping();
      emitSocket('chat-user-message', {message: message});
      input.val('');
    }
  });

  $('#chat-form [name="message"]').on('keyup keydown', function(){
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(stopTyping, typingDelay);

    if ($(this).val() === "") {
      stopTyping();
    } else if (!isTyping) {
      startTyping();
    }
  });

  //receive sockets
  socket.on('chat-user-message', function(data) {
    data = JSON.parse(data);
    addChatLog(`${data.user}: ${data.message}`);
  });

  socket.on('chat-system-message', function(data) {
    data = JSON.parse(data);
    addChatLog(`${data.message}`);
  });

  socket.on('chat-user-typing', function(data) {
    data = JSON.parse(data);

    delete data[username]; //remove current user

    const typingUsers = Object.keys(data);

    let text = "";
    if (typingUsers.length > 0) {
      typingUsers.forEach((user) => {
        if (text) {
          text += ", ";
        }
        text += user;
      });

      if (typingUsers.length == 1) {
        text += " is typing.";
      } else {
        text += " are typing.";
      }

    }


    $("#typing-users-list").html(text);
  });
});
