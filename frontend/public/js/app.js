const username = prompt("Enter your username ...");

const socket = new WebSocket(`ws://localhost:4001/${username}`);

let userID = null;
let typingTimeout;

const input = document.querySelector(".message-box");
const chat = document.querySelector(".messages-chat");

socket.addEventListener("open", () => {
    input.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            if (event.target.value.trim()) {
                socket.send(
                    JSON.stringify({
                        type: "message",
                        content: event.target.value.trim(),
                    })
                );
                input.value = "";
            }
        } else {
            console.log("injam");
            sendTypingNotification();
        }
    });

    socket.addEventListener("message", (event) => {
        console.log(111111111);
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
        } else if (data.typing !== undefined) {
            console.log(data.typing , "data.typing");
            showTypingNotification(data.userID, data.typing);
        } else {
            userID = data.userID;
        }
    });
});

const sendTypingNotification = () => {
    socket.send(JSON.stringify({ type: "typing" }));
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.send(JSON.stringify({ type: "stop_typing" }));
    }, 3000);
};

const showTypingNotification = (userID, isTyping) => {
    console.log(333333);
    let typingElement = document.getElementById(`typing-${userID}`);
    if (isTyping) {
        if (!typingElement) {
            typingElement = document.createElement("div");
            typingElement.id = `typing-${userID}`;
            typingElement.classList.add("typing-notification");
            typingElement.textContent = `${userID} is typing...`;
            chat.appendChild(typingElement);
        }
    } else {
        if (typingElement) {
            console.log("khaaaar");
            chat.removeChild(typingElement);
        }
    }
};

// const onclose = (event) => {
//     console.log(event, "close");
// };
