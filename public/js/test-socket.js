const socket = io()

const messageInput = document.getElementById('messageInput');
const messageParagraph = document.getElementById('messageParagraph');

messageInput.addEventListener('input', () => {
  const message = messageInput.value;
  socket.emit('msg_front_back', {
    msg: message,
    user: 'usuario anonimo'
  });
});

socket.on('msg_back_front', (msg) => {
    console.log(msg);
    messageParagraph.textContent = msg.msg;
});
