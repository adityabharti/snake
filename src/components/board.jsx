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
    maxSpeed: false,
  };

  isInsectOnSnake(snakeCoords, row, col) {
    /**
     * Check if the insect's co-ordinates co-incide with that of the snake.
     * This method is called while generating insect's co-ordinates.
     */
    for (let i = 0; i < snakeCoords.length; i++) {
      if (row === snakeCoords[i][0] && col === snakeCoords[i][1]) {
        return true;
      }
    }
    return false;
  }

  changeDirection = (event) => {
    /**
     * Upon an arrow key press, determine if the key press is valid and
     * accordingly set the state.
     */
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
    /**
     * Entire logic to move the Snake.
     */
    const snakeCo = [...this.state.snakeCoordinates];
    const griddy = [...this.state.grid];
    let highScore = this.state.highScore;
    let x, y;
    let randomRow, randomCol;
    let maxSpeed = this.state.maxSpeed;

    // To allow the snake to move, remove the presence of the snake from
    // old squares.
    for (let i = 0; i < snakeCo.length; i++) {
      griddy[snakeCo[i][0]][snakeCo[i][1]] = "";
    }

    // Obtain the last co-ordinates to modify and set accordingly based on the
    // direction.
    x = snakeCo[snakeCo.length - 1][0];
    y = snakeCo[snakeCo.length - 1][1];

    // Tail of the snake is not needed anymore, remove it.
    const [old_coord_x, old_coord_y] = snakeCo.shift();

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

    // Check is insect is about to be eaten
    // If yes then generate a new insect
    // Also, buggy code below, not sure why modulo ROWS is done,
    // but it solves the issue, investigate later
    if (griddy[x % ROWS][y] === INSECT) {
      [randomRow, randomCol] = this.generateInsect(griddy, snakeCo);
      snakeCo.unshift([old_coord_x, old_coord_y]);
      highScore += 1;

      // Speed Control logic here
      if (highScore % 3 === 0) {
        clearInterval(this.interval);
        let newTimeInterval = MOVE_TIME_INTERVAL - 10 * highScore - 2;

        if (newTimeInterval < 40) {
          newTimeInterval = 40;
          maxSpeed = true;
        }

        this.interval = setInterval(() => this.moveSnake(), newTimeInterval);
      }
    } else if (isSnakeHeadOnBody(snakeCo)) {
      alert(`Game Over! Your score was: ${this.state.highScore}`);
      document.removeEventListener("keydown", this.changeDirection, false);
      window.location.reload();
    }

    // Update the grid with new snake co-ordinates.
    for (let i = 0; i < snakeCo.length; i++)
      griddy[snakeCo[i][0]][snakeCo[i][1]] = "S";

    this.setState({
      grid: griddy,
      snakeCoordinates: snakeCo,
      insectRow: randomRow,
      insectCol: randomCol,
      highScore: highScore,
      maxSpeed: maxSpeed,
    });
  }

  componentDidMount() {
    /**
     * After the Board component has mounted:
     * 1. Set the grid.
     * 2. Initialise the default snake and lay it on the grid.
     * 3. Generate the Insect's co-ordinates.
     * 4. Set event listener on the 'document' to move the snake on arrow key
     *    press.
     */
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
    /**
     * On Board component unmount, clear the interval and remove the event
     * listener.
     */
    clearInterval(this.interval);
    document.removeEventListener("keydown", this.changeDirection, false);
  }

  generateInsect(grid, snakeCoordinates) {
    /**
     * Generate the Insect.
     */

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
    const { grid } = this.state;

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
        <h3>{this.state.highScore}</h3>
        {this.state.maxSpeed ? <p>You've reached maximum speed!</p> : null}
      </div>
    );
  }
}

export default Board;
