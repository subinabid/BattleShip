//import { someFunction } from "./index";

import {
  Direction,
  Gameboard,
  Ship,
  Request,
  Response,
  indexToRow,
  indexToColumn,
  rowToIndex,
  columntoIndex,
  defend,
  Row,
  Column,
} from ".";

const ships = [
  new Ship({ name: "Carrier", length: 5 }, { x: "A", y: 1 }, "Horizontal"),
  new Ship({ name: "Battleship", length: 4 }, { x: "B", y: 1 }, "Horizontal"),
  new Ship({ name: "Submarine", length: 3 }, { x: "C", y: 1 }, "Horizontal"),
  new Ship({ name: "Cruiser", length: 3 }, { x: "D", y: 1 }, "Horizontal"),
  new Ship({ name: "Destroyer", length: 2 }, { x: "E", y: 1 }, "Horizontal"),
];

const overlappingShips = [
  new Ship({ name: "Carrier", length: 5 }, { x: "A", y: 1 }, "Horizontal"),
  new Ship({ name: "Battleship", length: 4 }, { x: "B", y: 1 }, "Vertical"),
  new Ship({ name: "Submarine", length: 3 }, { x: "C", y: 3 }, "Horizontal"),
  new Ship({ name: "Cruiser", length: 3 }, { x: "D", y: 1 }, "Vertical"),
  new Ship({ name: "Destroyer", length: 2 }, { x: "E", y: 1 }, "Horizontal"),
];

describe("Grid", () => {
  it("should convert index to row", () => {
    expect(indexToRow(0)).toBe("A");
    expect(indexToRow(9)).toBe("J");
  });

  it("should convert index to column", () => {
    expect(indexToColumn(0)).toBe(1);
    expect(indexToColumn(9)).toBe(10);
  });

  it("should convert row to index", () => {
    expect(rowToIndex("A")).toBe(0);
    expect(rowToIndex("J")).toBe(9);
  });

  it("should convert column to index", () => {
    expect(columntoIndex(1)).toBe(0);
    expect(columntoIndex(10)).toBe(9);
  });
});

describe("Game board", () => {
  it("should define the board for correct config", () => {
    expect(() => {
      new Gameboard(ships);
    }).toBeDefined();
  });

  it("should fail for overlaping ships", () => {
    expect(() => {
      new Gameboard(overlappingShips);
    }).toThrow();
  });
});

describe("Game play", () => {
  it("should hit a ship at the right spot", () => {
    const gameboard = new Gameboard(ships);
    const request: Request = { position: { x: "A", y: 1 } };
    expect(defend(gameboard, request)).toBe("Hit");
  });

  it("should miss a ship at the wrong spot", () => {
    const gameboard = new Gameboard(ships);
    const request: Request = { position: { x: "A", y: 10 } };
    expect(defend(gameboard, request)).toBe("Miss");
  });

  it("should sink a ship", () => {
    const gameboard = new Gameboard(ships);
    const positions = [
      { x: "A" as Row, y: 1 as Column },
      { x: "A" as Row, y: 2 as Column },
      { x: "A" as Row, y: 3 as Column },
      { x: "A" as Row, y: 4 as Column },
      { x: "A" as Row, y: 5 as Column },
    ];
    positions.forEach((position) => {
      defend(gameboard, { position: position });
    });
    expect(defend(gameboard, { position: positions[4] })).toBe("Sunk");
  });
});
