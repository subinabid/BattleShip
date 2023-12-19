import { createServer } from "net";

var server = createServer((socket) => {
  console.log("Client connected");

  socket.write("Echo server\r\n");

  socket.on("data", (message) => {
    console.log("Got message", {
      socket: socket.address(),
      m: message.toString(),
    });

    socket.write("OK\r\n");
  });

  //  socket.pipe(socket);
});

server.listen(1337, "127.0.0.1");
