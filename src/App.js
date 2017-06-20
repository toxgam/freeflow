import React, {Component} from 'react'
import {BrowserRouter as Router} from 'react-router-dom'

import LevelList from './LevelList'
import Board from './Board'

export default class App extends Component {
  render() {
    //  <Board windowSize={this.state.windowSize} />

    return (
      <Router>
        <div>
          {LevelList.route}
          {Board.route}
        </div>
      </Router>
    )
  }
};
