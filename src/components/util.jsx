import { cst } from "./consts";
const { ROWS, COLS } = cst;

export const getRandomRowCol = () => {
  return [Math.floor(Math.random() * ROWS), Math.floor(Math.random() * COLS)];
};

export const getGrid = () => {
  const grid = [];
  for (let row = 0; row < ROWS; row++) {
    const temp_row = [];
    for (let col = 0; col < COLS; col++) {
      temp_row.push("");
    }
    grid.push(temp_row);
  }
  return grid;
};

export const isSnakeHeadOnBody = (snakeCoordinates) => {
  const snakeLength = snakeCoordinates.length;
  const head_x = snakeCoordinates[snakeLength - 1][0];
  const head_y = snakeCoordinates[snakeLength - 1][1];

  for (let i = 0; i < snakeLength - 1; i++) {
    if (head_x === snakeCoordinates[i][0] && head_y === snakeCoordinates[i][1])
      return true;
  }
  return false;
};
