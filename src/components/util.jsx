import { cst } from "./consts";

export const getRandomRowCol = () => {
  return [
    Math.floor(Math.random() * cst.ROWS),
    Math.floor(Math.random() * cst.COLS),
  ];
};
