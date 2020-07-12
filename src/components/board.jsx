import React, { Component } from "react";
import "./board.css";
import Square from "./square";
import { getRandomRowCol, getGrid, isSnakeHeadOnBody } from "./util";
import { cst, snakes_tail, arrowKey } from "./consts";

const { ROWS, COLS, INSECT, SNAKE_LENGTH, MOVE_TIME_INTERVAL } = cst;
const { LEFT, UP, RIGHT, DOWN } = arrowKey;
const SNAKES_TAIL_X = snakes_tail.x;
const SNAKES_TAIL_Y = snakes_tail.y;

class Board extends Component {
  state = {
    grid: [],
    insectRow: 0,
    insectCol: 0,
    snakeCoordinates: [],
    prev_direction: RIGHT,
    direction: RIGHT,
    snake_length: SNAKE_LENGTH,
    highScore: 0,
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
    let prev_direction = this.state.direction;
    let direction = null;

    if (event.keyCode === UP) direction = UP;
    else if (event.keyCode === LEFT) direction = LEFT;
    else if (event.keyCode === DOWN) direction = DOWN;
    else if (event.keyCode === RIGHT) direction = RIGHT;

    if (
      ((prev_direction === RIGHT || prev_direction === LEFT) &&
        (direction === UP || direction === DOWN)) ||
      ((prev_direction === UP || prev_direction === DOWN) &&
        (direction === LEFT || direction === RIGHT))
    ) {
      this.setState({ prev_direction: prev_direction, direction: direction });
    }
  };

  moveSnake() {
    const snakeCo = [...this.state.snakeCoordinates];
    const griddy = [...this.state.grid];
    let highScore = this.state.highScore;
    let x, y;
    let randomRow, randomCol;

    // var s = "";
    // for (let i = 0; i < snakeCo.length; i++) {
    //   s += snakeCo[i][0] + "-" + snakeCo[i][1] + "  ";
    // }
    // console.log(s);

    for (let i = 0; i < snakeCo.length; i++) {
      griddy[snakeCo[i][0]][snakeCo[i][1]] = "";
    }

    x = snakeCo[snakeCo.length - 1][0];
    y = snakeCo[snakeCo.length - 1][1];
    const [old_coord_x, old_coord_y] = snakeCo.shift();

    // console.log("x is ", x, " y is ", y);
    if (this.state.direction === RIGHT) {
      y += 1;
      snakeCo.push([x, y % COLS]);
    } else if (this.state.direction === DOWN) {
      x += 1;
      snakeCo.push([x % ROWS, y]);
    } else if (this.state.direction === LEFT) {
      y -= 1;
      y = y < 0 ? y + COLS : y;
      snakeCo.push([x, y % COLS]);
    } else if (this.state.direction === UP) {
      x -= 1;
      x = x < 0 ? x + ROWS : x;
      snakeCo.push([x % ROWS, y]);
    }
    //console.log("x is ", x, " y is ", y);

    // Check is insect is about to be eaten
    // If yes then generate a new insect
    // Also, buggy code below, not sure why modulo ROWS is done,
    // but it solves the issue, investigate later
    if (griddy[x % ROWS][y] === INSECT) {
      [randomRow, randomCol] = this.generateInsect(griddy, snakeCo);
      snakeCo.unshift([old_coord_x, old_coord_y]);
      highScore += 1;
      console.log("High score is: ", this.state.highScore);

      // document.removeEventListener("keydown", this.changeDirection, false);
      // document.addEventListener("keydown", this.changeDirection, false);
      // this.interval = setInterval(() => this.moveSnake(), MOVE_TIME_INTERVAL);
    } else if (isSnakeHeadOnBody(snakeCo)) {
      alert(`Game Over! Your score was: ${this.state.highScore}`);
      window.location.reload();
    }

    for (let i = 0; i < snakeCo.length; i++)
      griddy[snakeCo[i][0]][snakeCo[i][1]] = "S";

    this.setState({
      grid: griddy,
      snakeCoordinates: snakeCo,
      insectRow: randomRow,
      insectCol: randomCol,
      highScore: highScore,
    });
  }

  componentDidMount() {
    // Get default grid
    const grid = getGrid();

    // Set default snake on board
    // snake tail at 3, 3
    const snakeCoordinates = [];

    for (let i = 0; i < SNAKE_LENGTH; i++) {
      grid[SNAKES_TAIL_X][SNAKES_TAIL_Y + i] = "S";
      snakeCoordinates.push([SNAKES_TAIL_X, SNAKES_TAIL_Y + i]);
    }

    const [randomRow, randomCol] = this.generateInsect(grid, snakeCoordinates);

    // Finally set the state
    this.setState({
      grid: grid,
      insectRow: randomRow,
      insectCol: randomCol,
      snakeCoordinates: snakeCoordinates,
    });

    document.addEventListener("keydown", this.changeDirection, false);

    this.interval = setInterval(() => this.moveSnake(), MOVE_TIME_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    document.removeEventListener("keydown", this.changeDirection, false);
  }

  generateInsect(grid, snakeCoordinates) {
    // Set the default random coordinates for the insect
    let [randomRow, randomCol] = getRandomRowCol();

    //Ensure insect is not sitting on the snake
    while (this.isInsectOnSnake(snakeCoordinates, randomRow, randomCol)) {
      [randomRow, randomCol] = getRandomRowCol();
    }
    grid[randomRow][randomCol] = INSECT;
    return [randomRow, randomCol];
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
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((col, colIdx) => {
                return (
                  <Square
                    key={`${rowIdx} ${colIdx}`}
                    value={grid[rowIdx][colIdx]}
                  ></Square>
                );
              })}
            </div>
          );
        })}
        <div>HIGH SCORE: {this.state.highScore}</div>
      </div>
    );
  }
}

export default Board;
