import React, {Component} from 'react';
import {Layer, Stage} from 'react-konva';

import Board from './Board';

export default class App extends Component {
  render() {
    return (
      <Stage width={700} height={700}>
        <Layer>
          <Board />
        </Layer>
      </Stage>
    );
  }
};
