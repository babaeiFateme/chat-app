const socket = io("http://localhost:4001", {
    query: {
        name: "fateme",
        field: "JS developer",
    },
    transportOptions: {
        polling: {
            extraHeaders: {
                "Content-type": "application/json",
            },
        },
    },
});

const input = document.querySelector(".message-box");
const chat = document.querySelector(".messages-chat");
const typingIndicator = document.getElementById("typingIndicator");

let typingTimeout;

input.addEventListener("input", () => {
    if (input.value) {
        socket.emit("typing");
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socket.emit("stopTyping");
        }, 2000);
    } else {
        socket.emit("stopTyping");
    }
});
socket.on("connect", () => {
    input.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            if (event.target.value.trim()) {
                socket.emit("message", event.target.value.trim());
                input.value = "";
            }
        }
    });

    socket.on("message", (data) => {
        chat.insertAdjacentHTML(
            "beforeend",
            `${
                data.id === socket.id
                    ? `<div class="message">
                        <div class="response">
                            <p class="text">${data.message}</p>
                            <p class="time">${new Date().getHours()} : ${new Date().getMinutes()} :${new Date().getSeconds()} </p>
                        </div>
                    </div>`
                    : `<div class="message">
                        <p class="text">${data.message}</p>
                        </div>
                        <p class="time">${new Date().getHours()} : ${new Date().getMinutes()} :${new Date().getSeconds()} </p>`
            }`
        );
    });
});

socket.on("typing", () => {
    typingIndicator.style.display = "block";
});

socket.on("stopTyping", () => {
    typingIndicator.style.display = "none";
});
