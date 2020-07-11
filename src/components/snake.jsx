import React, { Component } from "react";
import "./snake.css";
import Square from "./square";

class Snake extends Component {
  state = {
    grid: [],
  };

  componentDidMount() {
    const grid = [];
    for (let row = 0; row < 5; row++) {
      const temp_row = [];
      for (let col = 0; col < 5; col++) {
        const currSqr = {
          value: ".",
        };
        temp_row.push(currSqr);
      }
      grid.push(temp_row);
    }
    // console.log("Inside comp did mount");
    // console.log(grid);
    // console.log("\n");

    this.setState({ grid });
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
                    value={this.state.value}
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
