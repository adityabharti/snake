import React, { Component } from "react";
import "./square.css";
class Square extends Component {
  render() {
    //console.log(this.props.children);
    return <div className="square">{this.props.value}</div>;
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
