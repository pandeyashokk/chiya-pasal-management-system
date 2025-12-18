const http = require("http");
const app = require("./app");
const { port } = require("./config/keys");

const server = http.createServer(app);
const initSocket = require("./socket");

//initialize socket.io
const io = initSocket(server);

// Attach io to app so controllers can use it
app.set("io", io);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("Socket.io is ready for real time updates");
});
