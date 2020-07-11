import React, { Component } from "react";
import "./square.css";
class Square extends Component {
  render() {
    let squareClasses = "square ";
    if (this.props.value === "I") squareClasses += "insect ";
    else if (this.props.value === "S") squareClasses += "snake ";

    return <div className={squareClasses}></div>;
  }
}

export default Square;

// super();
// var x = new Array(10).fill(".");

// for (var i = 0; i < x.length; i++) {
//   x[i] = new Array(10).fill(".");
// }
// for (var i = 0; i < x.length; i++) {
//   for (var j = 0; j < x[i].length; j++) {
//     console.log(x[i][j]);
//   }
//   console.log("\n");
// }
