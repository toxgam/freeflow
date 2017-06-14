import React, {Component} from 'react';
import Konva from 'konva';
import {Rect} from 'react-konva';

export default class MyRect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: Konva.Util.getRandomColor()
    };
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <Rect
        x={10} y={10} width={350} height={350}
        fill={this.state.color}
        shadowBlur={10}
        onClick={this.handleClick}
      />
    );
  }

  handleClick() {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  }
};
