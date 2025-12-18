const socketIo = require("socket.io");

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*", //change to frontend url later
      methods: ["GET", "POST"],
    },
  });

  //store connected users by role
  const users = {};

  io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    //user joins their role room
    socket.on("joinRole", (role) => {
      socket.leaveAll();
      socket.join(role);
      if (!users[role]) users[role] = [];
      users[role].push(socket.id);
      console.log(`${socket.id} joined as ${role}`);
    });

    // Optional: Customer joins table room
    socket.on("joinTable", (tableId) => {
      socket.join(`table-${tableId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      // Clean up users list (optional)
    });
  });

  // Global io instance to use in controllers
  io.users = users;
  return io;
};

module.exports = initSocket;
