const { log } = require("console");
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
    const userID = req.url.slice(1);
    socket.id = userID;
    socket.send(JSON.stringify({ userID }));

    socket.on("message", (data) => {
        const message = data.toString();
        const parsedData = JSON.parse(message);
        if (parsedData.type === "message") {
            console.log(parsedData.type , "parsedData.type");
            ws.clients.forEach((client,index) => {
                client.send(
                    JSON.stringify({
                        userID: socket.id,
                        message: parsedData.content,
                    })
                );
            });
        } else if (parsedData.type === "typing") {
            console.log(222222222);
            ws.clients.forEach((client, index) => {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send(
                        JSON.stringify({
                            userID: socket.id,
                            typing: true,
                        })
                    );
                } else if (parsedData.type === "stop_typing") {
                    ws.clients.forEach((client,index) => {
                        if (
                            client !== socket &&
                            client.readyState === WebSocket.OPEN
                        ) {
                            client.send(
                                JSON.stringify({
                                    userID: socket.id,
                                    typing: false,
                                })
                            );
                        }
                    });
                    
                }
            });
        }
    });
});

// Start the HTTP server on port 4001
server.listen(4001, () => {
    console.log("Server is listening on port 4001");
});
