import React, { Component } from "react";
import "./board.css";
import Square from "./square";
import { getRandomRowCol, getGrid } from "./util";
import { cst, snakes_tail } from "./consts";

const { INSECT, DEFAULT_SNAKE_LENGTH } = cst;
const SNAKES_TAIL_X = snakes_tail.x;
const SNAKES_TAIL_Y = snakes_tail.y;

class Board extends Component {
  state = {
    grid: [],
    insectRow: 0,
    insectCol: 0,
    value: "",
    snakeCoordinates: [],
  };

  isInsectOnSnake(snakeCoords, row, col) {
    for (let i = 0; i < snakeCoords.length; i++) {
      if (row === snakeCoords[i][0] && col === snakeCoords[i][1]) {
        return true;
      }
    }
    return false;
  }

  moveSnake() {
    console.log("Inside moveSnake method, ", this.state.snakeCoordinates);
    return;
  }

  componentDidMount() {
    console.log("entering didMount");

    // Get default grid
    const grid = getGrid();

    // Set default snake on board
    // snake tail at 3, 3
    const snakeCoordinates = [];

    for (let i = 0; i < DEFAULT_SNAKE_LENGTH; i++) {
      grid[SNAKES_TAIL_X][SNAKES_TAIL_Y + i].value = "S";
      snakeCoordinates.push([SNAKES_TAIL_X, SNAKES_TAIL_Y + i]);
    }

    // Set the default random coordinates for the insect
    let [randomRow, randomCol] = getRandomRowCol();

    //Ensure insect is not sitting on the snake
    while (this.isInsectOnSnake(snakeCoordinates, randomRow, randomCol)) {
      [randomRow, randomCol] = getRandomRowCol();
    }
    grid[randomRow][randomCol].value = INSECT;

    // Finally set the state
    this.setState({
      grid: grid,
      insectRow: randomRow,
      insectCol: randomCol,
      snakeCoordinates: snakeCoordinates,
    });

    //this.interval = setInterval(() => this.moveSnake(), 500);
    console.log("exiting didMount");
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    console.log("entering render");
    const { grid } = this.state;
    console.log(this.state);
    // console.log("render ", this.state.insectRow, " -- ", this.state.insectCol);
    return (
      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((col, colIdx) => {
                return (
                  <Square
                    key={`${rowIdx} ${colIdx}`}
                    value={grid[rowIdx][colIdx].value}
                  ></Square>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Board;
