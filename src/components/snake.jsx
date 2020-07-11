import React, { Component } from "react";
import "./snake.css";
import Square from "./square";
import { getRandomRowCol } from "./util";
import { cst } from "./consts";

class Snake extends Component {
  state = {
    grid: [],
  };

  componentDidMount() {
    const grid = [];
    for (let row = 0; row < cst.ROWS; row++) {
      const temp_row = [];
      for (let col = 0; col < cst.COLS; col++) {
        const currSqr = {
          value: "",
        };
        temp_row.push(currSqr);
      }
      grid.push(temp_row);
    }
    // console.log("Inside comp did mount");
    // console.log(grid);
    // console.log("\n");
    const [randomRow, randomCol] = getRandomRowCol();
    console.log(randomRow);
    console.log(randomCol);

    grid[randomRow][randomCol].value = cst.INSECT;
    this.setState({ grid });
  }

  render() {
    const { grid } = this.state;
    console.log(grid);
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

export default Snake;
