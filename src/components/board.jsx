import React, { Component } from "react";
import "./board.css";
import Square from "./square";
import { getRandomRowCol, getGrid } from "./util";
import { cst, snakes_tail, arrowKey } from "./consts";

const { ROWS, COLS, INSECT, DEFAULT_SNAKE_LENGTH, MOVE_TIME_INTERVAL } = cst;
const { LEFT, UP, RIGHT, DOWN } = arrowKey;
const SNAKES_TAIL_X = snakes_tail.x;
const SNAKES_TAIL_Y = snakes_tail.y;

class Board extends Component {
  state = {
    grid: [],
    insectRow: 0,
    insectCol: 0,
    snakeCoordinates: [],
    default_direction: RIGHT,
  };

  isInsectOnSnake(snakeCoords, row, col) {
    for (let i = 0; i < snakeCoords.length; i++) {
      if (row === snakeCoords[i][0] && col === snakeCoords[i][1]) {
        return true;
      }
    }
    return false;
  }

  changeDirection = (event) => {
    let default_direction = null;
    if (event.keyCode === UP) default_direction = UP;
    else if (event.keyCode === LEFT) default_direction = LEFT;
    else if (event.keyCode === DOWN) default_direction = DOWN;
    else if (event.keyCode === RIGHT) default_direction = RIGHT;

    if (default_direction)
      this.setState({ default_direction: default_direction });
  };

  moveSnake() {
    const snakeCo = [...this.state.snakeCoordinates];
    const griddy = [...this.state.grid];

    for (let i = 0; i < snakeCo.length; i++) {
      griddy[snakeCo[i][0]][snakeCo[i][1]] = "";
    }

    for (let i = 0; i < snakeCo.length; i++) {
      if (snakeCo[i][1] < COLS - 1) snakeCo[i][1] += 1;
      else snakeCo[i][1] = 0;
      griddy[snakeCo[i][0]][snakeCo[i][1]] = "S";
    }

    this.setState({ grid: griddy, snakeCoordinates: snakeCo });
  }

  componentDidMount() {
    console.log("entering didMount");

    // Get default grid
    const grid = getGrid();

    // Set default snake on board
    // snake tail at 3, 3
    const snakeCoordinates = [];

    for (let i = 0; i < DEFAULT_SNAKE_LENGTH; i++) {
      grid[SNAKES_TAIL_X][SNAKES_TAIL_Y + i] = "S";
      snakeCoordinates.push([SNAKES_TAIL_X, SNAKES_TAIL_Y + i]);
    }

    // Set the default random coordinates for the insect
    let [randomRow, randomCol] = getRandomRowCol();

    //Ensure insect is not sitting on the snake
    while (this.isInsectOnSnake(snakeCoordinates, randomRow, randomCol)) {
      [randomRow, randomCol] = getRandomRowCol();
    }
    grid[randomRow][randomCol] = INSECT;

    // Finally set the state
    this.setState({
      grid: grid,
      insectRow: randomRow,
      insectCol: randomCol,
      snakeCoordinates: snakeCoordinates,
    });

    document.addEventListener("keydown", this.changeDirection, false);

    this.interval = setInterval(() => this.moveSnake(), MOVE_TIME_INTERVAL);
    console.log("exiting didMount");
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    document.removeEventListener("keydown", this.changeDirection, false);
  }

  render() {
    // const element = document.getElementsByTagName("html");
    // console.log(element);
    // element.addEventListener("keydown", this.changeDirection);
    // console.log("entering render");
    const { grid } = this.state;
    //console.log(this.state);
    // console.log("render ", this.state.insectRow, " -- ", this.state.insectCol);
    return (
      <div className="grid">
        <button onKeyDown={this.changeDirection}>Press Me</button>
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((col, colIdx) => {
                return (
                  <Square
                    key={`${rowIdx} ${colIdx}`}
                    value={grid[rowIdx][colIdx]}
                    // onkeypress={this.changeDirection}
                    // tabIndex="0"
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
