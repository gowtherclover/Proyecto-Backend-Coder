const socket = io()

const chatBox = document.getElementById("input-msg");

let nombreUsuario = ""

async function main() {
  const { value: nombre } = await Swal.fire({
    title: "Enter your name",
    input: "text",
    inputLabel: "Your name",
    inputValue: "",
    allowOutsideClick:false,
    showCancelButton: false,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });

  if (nombre) {
    nombreUsuario = nombre;
    Swal.fire(`Your name is ${nombreUsuario}`);
  } else {
    Swal.fire(`Nombre no ingresado`);
  }
}

main();

chatBox.addEventListener("keyup", ({ key }) => {
  if (key == "Enter") {
    socket.emit("msg_front_back", {
      msg: chatBox.value,
      user: nombreUsuario,
    });
    chatBox.value = "";
  }
});

socket.on('msg_back_front', (msgs) => {
  const divMSG = document.getElementById('div-msgs')

  let formato = ''
  msgs.forEach((msg) => {
    formato = formato+ '<br>'+ msg.user+': ' + msg.msg
  });
  divMSG.innerHTML = formato
});



/* const messageInput = document.getElementById('messageInput');
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
}); */
