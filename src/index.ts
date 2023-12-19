export type Row = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";
export type Column = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Direction = "Horizontal" | "Vertical";
export interface Position {
  x: Row;
  y: Column;
}
type ShipCellState = "Healthy" | "Hit";
type GridState = "Empty" | "Miss" | Ship;

export type Request = {
  position: Position;
  // Board or GameID eventually
};

export type Response = "Miss" | "Hit" | "Sunk";

const validatePosition = (
  { x, y }: Position, // start
  direction: Direction,
  length: number
): Array<Position> => {
  if (direction === "Horizontal") {
    if (y + length > 10) {
      throw new Error(`Ship is out of bounds: ${x}${y + length}`);
    }
  } else {
    if (x.charCodeAt(0) + length > 74) {
      throw new Error(
        `Ship is out of bounds: ${String.fromCharCode(
          x.charCodeAt(0) + length
        )}${y}`
      );
    }
  }

  const positions: Array<Position> = [];
  for (let i = 0; i < length; i++) {
    if (direction === "Horizontal") {
      positions.push({ x, y: (y + i) as Column });
    } else {
      positions.push({ x: String.fromCharCode(x.charCodeAt(0) + i) as Row, y });
    }
  }

  return positions;
};

type ShipType =
  | { name: "Carrier"; length: 5 }
  | { name: "Battleship"; length: 4 }
  | { name: "Submarine"; length: 3 }
  | { name: "Cruiser"; length: 3 }
  | { name: "Destroyer"; length: 2 };

export class Ship {
  shipType: ShipType;
  cells: Array<{ position: Position; state: ShipCellState }>;

  constructor(shipType: ShipType, start: Position, direction: Direction) {
    this.shipType = shipType;
    this.cells = validatePosition(start, direction, shipType.length).map(
      (position) => ({ position, state: "Healthy" })
    );
  }
}

// Gameboard
export class Gameboard {
  myBoard: Array<Array<GridState>>;
  theirBoard: Array<Array<Response | "Empty">>;

  constructor(ships: Array<Ship>) {
    this.myBoard = [];
    this.theirBoard = [];

    for (let i = 0; i < 10; i++) {
      this.myBoard[i] = [];
      this.theirBoard[i] = [];
      for (let j = 0; j < 10; j++) {
        this.myBoard[i][j] = "Empty";
        this.theirBoard[i][j] = "Empty";
      }
    }

    ships.forEach((ship) => {
      ship.cells.forEach(({ position: { x, y } }) => {
        const current = this.myBoard[rowToIndex(x)][columntoIndex(y)];

        if (current === "Empty") {
          this.myBoard[rowToIndex(x)][columntoIndex(y)] = ship;
        } else {
          throw new Error(`Ship is overlapping at ${x}${y}`);
        }
      });
    });
  }
}

//Convert between index and row/column
export const indexToRow = (i: number): Row => {
  if (i < 0 || i > 9) {
    throw new Error(`Row is out of bounds: ${i}`);
  }
  return String.fromCharCode(i + 65) as Row;
};

export const indexToColumn = (i: number): Column => {
  if (i < 0 || i > 9) {
    throw new Error(`Column is out of bounds: ${i}`);
  }
  return (i + 1) as Column;
};

export const rowToIndex = (r: Row): number => r.charCodeAt(0) - 65;
export const columntoIndex = (c: Column): number => c - 1;

// Gameplay

// Attack your opponent
// export const attack = (gb: Gameboard, { position }: Request) => {
//   const bytes = JSON.stringify(position);
//   network.send(bytes);
//   const responsebytes = network.receive();
//   const op = JSON.parse(responsebytes) as Response;
//   gb.theirBoard[rowToIndex(x)][columntoIndex(y)] = op;
// };

// Uopdate their board after Attack
export const updateBoardAfterAttack = (
  gb: Gameboard,
  { x, y }: Position,
  response: Response
) => {
  gb.theirBoard[rowToIndex(x)][columntoIndex(y)] = response;
};

// Respond to attack
export const defend = (
  gb: Gameboard,
  { position: { x, y } }: Request
): Response => {
  const cell = gb.myBoard[rowToIndex(x)][columntoIndex(y)];

  switch (cell) {
    case "Empty":
      gb.myBoard[rowToIndex(x)][columntoIndex(y)] = "Miss";
      return "Miss";

    case "Miss":
      return "Miss";

    default:
      cell.cells.find(
        (cell) => cell.position.x === x && cell.position.y === y
      )!.state = "Hit";

      return cell.cells.every((cell) => cell.state === "Hit")
        ? //
          "Sunk"
        : "Hit";
  }
};

// const game = new Gameboard([]);

// while (true) {
//   const bytes = network.receive("Enter x");
//   const request = parse(bytes) as Request;
//   const reponse = bombed(game, x.position);
//   network.send(reponse);
// }
