import React, {Component} from 'react';
import {Circle, Group, Line, Rect} from 'react-konva';

import {game1} from './data';

const MyLine = ({points, color}) => {
  return (
    <Line
      points={points}
      stroke={color}
      strokeWidth={5}
      lineCap="round"
      lineJoin="round"
    />
  );
};

const MyCircle = ({cellSize, x, y, color}) => {
  return (
    <Circle
      x={x * cellSize + cellSize / 2}
      y={y * cellSize + cellSize / 2}
      radius={cellSize / 3}
      fill={color}
      strokeWidth={4}
    />
  );
};

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: game1.size,
      fixed: game1.colors,
      lines: {
        red: [0, 0, 0, 1, 1, 1]
      },
      selectedColor: undefined
    }
    this.bg = undefined;
  }

  render() {
    const cellSize = this.props.windowSize / this.state.size;
    const array = [...Array(this.state.size + 1).keys()];

    return (
      <Group>
        {array.map(idx =>
          <MyLine
            points={[0, idx * cellSize, this.props.windowSize, idx * cellSize]}
            color="black"
          />
        )}

        {array.map(idx =>
          <MyLine
            points={[idx * cellSize, 0, idx * cellSize, this.props.windowSize]}
            color="black"
          />
        )}

        {Object.keys(this.state.fixed).map((color, idx) => {
          const points = this.state.fixed[color];

          return (
            <Group key={idx}>
              <MyCircle cellSize={cellSize} x={points[0]} y={points[1]} color={color} />
              <MyCircle cellSize={cellSize} x={points[2]} y={points[3]} color={color} />
            </Group>
          );
        })}

        {Object.keys(this.state.lines).map((color, idx) => {
          const points = this.state.lines[color];
          return (
            <MyLine
              key={idx}
              points={points.map(p => p * cellSize + cellSize / 2)}
              color="red"
            />
          );
        })}

        <Rect x={0} y={0} width={500} height={500} ref={r => this.bg = r} />
      </Group>
    );
  }

  componentDidMount() {
    const cellSize = this.props.windowSize / this.state.size;

    this.bg.on('mousedown', e => {
      console.log('xxxxx')

      const x = Math.floor(e.evt.x / cellSize);
      const y = Math.floor(e.evt.y / cellSize);
      //const color = getColor(fixed, x, y);
      const color = 'red';

      this.state.lines[color] = [];
      this.setState({selectedColor: color, lines: this.state.lines});
    });

    this.bg.on('mouseup', e => {
      this.setState({selectedColor: undefined});
    });

    this.bg.on('mousemove', e => {
      const color = this.state.selectedColor;
      if (!color) {
        return;
      }

      const x = Math.floor(e.evt.x / cellSize);
      const y = Math.floor(e.evt.y / cellSize);

      const points = this.state.lines[color];
      const lastX = points[points.length - 2];
      const lastY = points[points.length - 1];
      if (lastX === undefined || x === lastX || y === lastY) {
        points.push(x, y);
        this.setState({lines: this.state.lines});
      }
    });
  }
};
