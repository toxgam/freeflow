import React, {Component} from 'react';
import {Circle, Group, Line, Rect} from 'react-konva';

import {game1} from './data';

const CELL_SIZE = 100;

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

const MyCircle = ({x, y, color}) => {
  return (
    <Circle
      x={x * CELL_SIZE + CELL_SIZE / 2}
      y={y * CELL_SIZE + CELL_SIZE / 2}
      radius={CELL_SIZE / 3}
      fill={color}
      strokeWidth={4}
    />
  );
};

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fixed: game1,
      lines: {
        red: [0, 0, 0, 1, 1, 1]
      },
      selectedColor: undefined
    }
    this.bg = undefined;
  }

  render() {
    return (
      <Group>
        <MyLine points={[0, 0,   500, 0]}   color="black" />
        <MyLine points={[0, 100, 500, 100]} color="black" />
        <MyLine points={[0, 200, 500, 200]} color="black" />
        <MyLine points={[0, 300, 500, 300]} color="black" />
        <MyLine points={[0, 400, 500, 400]} color="black" />
        <MyLine points={[0, 500, 500, 500]} color="black" />

        <MyLine points={[0,   0, 0,   500]} color="black" />
        <MyLine points={[100, 0, 100, 500]} color="black" />
        <MyLine points={[200, 0, 200, 500]} color="black" />
        <MyLine points={[300, 0, 300, 500]} color="black" />
        <MyLine points={[400, 0, 400, 500]} color="black" />
        <MyLine points={[500, 0, 500, 500]} color="black" />

        {Object.keys(game1).map((color, idx) => {
          const points = game1[color];

          return (
            <Group key={idx}>
              <MyCircle x={points[0]} y={points[1]} color={color} />
              <MyCircle x={points[2]} y={points[3]} color={color} />
            </Group>
          );
        })}

        {Object.keys(this.state.lines).map((color, idx) => {
          const points = this.state.lines[color];
          return (
            <MyLine
              key={idx}
              points={points.map(p => p * CELL_SIZE + CELL_SIZE / 2)}
              color="red"
            />
          );
        })}

        <Rect x={0} y={0} width={500} height={500} ref={r => this.bg = r} />
      </Group>
    );
  }

  componentDidMount() {
    this.bg.on('mousedown', e => {
      console.log('xxxxx')

      const x = Math.floor(e.evt.x / CELL_SIZE);
      const y = Math.floor(e.evt.y / CELL_SIZE);
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

      const x = Math.floor(e.evt.x / CELL_SIZE);
      const y = Math.floor(e.evt.y / CELL_SIZE);

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
