import React, {Component} from 'react';
import {Layer, Stage} from 'react-konva';

import MyRect from './MyRect';

export default class App extends Component {
  render() {
    return (
      <Stage width={700} height={700}>
        <Layer>
          <MyRect/>
        </Layer>
      </Stage>
    );
  }
};
