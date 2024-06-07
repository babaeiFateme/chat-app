const http = require("http");
const socketIO = require("socket.io");

// Create an HTTP server
const server = http.createServer();

const io = socketIO(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log(socket.handshake.query , "query");
    // console.log(socket.handshake.headers , "headers");
    socket.on("message", (data) => {
        io.emit("message", {
            id: socket.id,
            message: data,
        });
    });
    socket.on("typing", () => {
        socket.broadcast.emit("typing", { id: socket.id });
    });
    socket.on("stopTyping", () => {
        socket.broadcast.emit("stopTyping", { id: socket.id });
    });
});

// Start the HTTP server on port 4001
server.listen(4001, () => {
    console.log("Server is listening on port 4001");
});
