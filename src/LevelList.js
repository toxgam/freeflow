import React, {Component} from 'react'
import {Link, Route} from 'react-router-dom'

class Level extends Component {
  render() {
    return (
      <div className="level">
        <Link to={`/levels/${this.props.id}`}>{this.props.id}</Link>
      </div>
    )
  }
}

export default class LevelList extends Component {
  static route = <Route exact path="/" component={LevelList}/>

  render() {
    return (
      <div>
        {[...Array(30).keys()].map(i => <Level key={i} id={i + 1} />)}
      </div>
    )
  }
}
