const socket = io();

const chatBox = document.getElementById("input-msg");

let emailIngresado = "";

async function main() {
  const { value: email } = await Swal.fire({
    title: "Enter your email",
    input: "text",
    inputLabel: "Your email",
    inputValue: "",
    allowOutsideClick: false,
    showCancelButton: false,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });

  if (email) {
    emailIngresado = email;
    Swal.fire(`Your email is ${emailIngresado}`);
  } else {
    Swal.fire(`email not entered`);
  }
}

main();

chatBox.addEventListener("keyup", ({ key }) => {
  if (key == "Enter") {
    socket.emit("msg_front_back", {
      message: chatBox.value,
      user: emailIngresado,
    });
    chatBox.value = "";
  }
});

socket.on("msg_back_front", (msgs) => {
  const divMSG = document.getElementById("div-msgs");

  let formato = "";
  msgs.forEach((msg) => {
      formato = formato + `<br><div class="user__chat">${msg.user}</div>: ${msg.message}`;
  });
  divMSG.innerHTML = formato;
});
