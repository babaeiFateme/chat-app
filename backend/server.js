const http = require("http");
const WebSocket = require("ws");

// Create an HTTP server
const server = http.createServer();

// Create a WebSocket server, using the HTTP server
const ws = new WebSocket.Server({ server });

// Event handler for WebSocket server 'headers' event
ws.on("headers", (headers) => {
    console.log("Headers received:", headers);
});

// Event handler for WebSocket server 'connection' event
ws.on("connection", (socket, req) => {
    console.log(req.url , "sdfsjkfshf");
    const userID = req.url.slice(1);
    socket.id = userID;
    socket.send(JSON.stringify({ userID }));

    socket.on("message", (data) => {
        ws.clients.forEach((client) => {
            client.send(
                JSON.stringify({
                    userID: socket.id,
                    message: data.toString(),
                })
            );
        });
    });
});

// Start the HTTP server on port 4001
server.listen(4001, () => {
    console.log("Server is listening on port 4001");
});
