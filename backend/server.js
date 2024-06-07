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
    socket.on("message", (data) => {
        io.emit("message", {
            id: socket.id,
            message: data,
        });
        console.log(data);
    });
});

// Start the HTTP server on port 4001
server.listen(4001, () => {
    console.log("Server is listening on port 4001");
});
