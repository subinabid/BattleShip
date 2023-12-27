import { createServer } from "net";
import { Gameboard } from "./game";

const game = new Gameboard([]);

const main = () => {
  var server = createServer((socket) => {
    console.log("Client connected");
    socket.write("Hello\r\n");
    const gameStatus = "GameStarted";

    // Inititate the Ships
    socket.write("Enter starting position for Carrier\r\n");

    socket.on("data", (message) => {
      switch (message.toString().trim()) {
        case "ping":
          socket.write("pong\r\n");
          break;
        case "board":
          socket.write(JSON.stringify(game.myBoard));
          break;
        case "A1":
        case "A2":
        case "A3":
        case "A4":
        case "A5":
          socket.write("Hit\r\n");
          break;
        default:
          console.log("GOT", { raw: message, s: message.toString() });
          socket.write("Boop\r\n");
          break;
      }

      // socket.write("OK\r\n");
    });

    //  socket.pipe(socket);
  });

  server.listen(1337, "127.0.0.1");
};

main();
