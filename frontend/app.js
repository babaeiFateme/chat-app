const username = prompt("Enter your username ...");

const socket = new WebSocket(`ws://localhost:4001/${username}`);

let userID = null;

const input = document.querySelector("input");
const chat = document.querySelector("ul");

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
                `<li class="${data.userID === userID ? "own" : ""}">${data.message}</li>`
            );
        } else {
            userID = data.userID;
        }
    });
});
