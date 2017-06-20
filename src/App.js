import React, {Component} from 'react'
import {Layer, Stage} from 'react-konva'

import Board from './Board'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      windowSize: window.innerWidth
    }
  }

  render() {
    return (
      <Stage width={this.state.windowSize} height={this.state.windowSize}>
        <Layer>
          <Board windowSize={this.state.windowSize} />
        </Layer>
      </Stage>
    )
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({windowSize: window.innerWidth})
    })
  }
};
