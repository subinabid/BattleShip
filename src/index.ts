/**
 * Initiate the game
 * Inititate the Ships
 * Place the ships
 * Start the game
 * Accept input from the user
 * Validate the input
 * Check if the input is a hit or a miss
 * Update the game board
 * Respond to the user
 * Check if the game is over
 * End the game if the game is over
 */

import { createServer } from "net";
import {
  Row,
  Column,
  Direction,
  Position,
  ships,
  Ship,
  Gameboard,
  parse,
  indexToRow,
  indexToColumn,
  validatePosition,
} from "./game";

// const game = new Gameboard([]);
type GameState = "GameStarted" | "GamePlay" | "GameOver" | "GameError";
let gameState: GameState = "GameStarted";

const onGameStart = (): string => {
  while (gameState === "GameStarted") {
    var newShips: Array<Ship> = [];

    ships.forEach((ship) => {
      const x = indexToRow(Math.floor(Math.random() * 10)); // Generate a random column between 1 and 10
      const y = indexToColumn(Math.floor(Math.random() * 10)); // Generate a random row between A and J
      const direction = Math.random() < 0.5 ? "Horizontal" : "Vertical"; // Generate a random direction
      const position: Position = { x, y };
      try {
        // Validate the position and direction of a single ship
        // The function will throw an error if the ship wont fit in the board
        // if valid, it will return the array of positions (cells) of the ship
        const shipPos = validatePosition(position, direction, ship.length);
        // Shit, there is no need for validating.
        // Ship initiator will validate anyway

        const placedShip = new Ship(ship, position, direction);
        newShips.push(placedShip);
      } catch (error) {
        console.log("Error in ship position: ");
      }
    });

    // Place the ships
    try {
      const game = new Gameboard(newShips);
      gameState = "GamePlay";
      console.log("Board initiated successfully!");
    } catch (error) {
      console.log("Error in placing ships: ");
      console.log("Retrying ...");
    }
  }
  return gameState;
};

const main = () => {
  var server = createServer((socket) => {
    socket.on("data", (message) => {
      // const pi = parse(message.toString());
      switch (gameState) {
        case "GameStarted":
          onGameStart();
          break;
        case "GamePlay":
          // Accept input from the user
          // Validate the input
          // Check if the input is a hit or a miss
          // Update the game board
          break;
        default:
          throw new Error("Invalid message type");
      }
    });
  });

  server.listen(1337, "127.0.0.1");
};

main();
