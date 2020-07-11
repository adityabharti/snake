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
      const currSqr = {
        value: "",
      };
      temp_row.push(currSqr);
    }
    grid.push(temp_row);
  }
  return grid;
};
