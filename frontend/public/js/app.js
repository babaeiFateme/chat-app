const username = prompt("Enter your username ...");

const socket = new WebSocket(`ws://localhost:4001/${username}`);

let userID = null;

const input = document.querySelector(".message-box");
const chat = document.querySelector(".messages-chat");

socket.addEventListener("open", () => {
    input.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            if (event.target.value.trim()) {
                socket.send(event.target.value.trim());
                input.value = "";
            }
        }
    });
    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        if (data.message) {
            chat.insertAdjacentHTML(
                "beforeend",
                `${
                    data.userID === userID
                        ? `<div class="message"><div class="response"><p class="text">${data.message}</p></div></div>`
                        : `<div class="message"><p class="text">${data.message}</p></div>`
                }`
            );
        } else {
            userID = data.userID;
        }
    });
});
