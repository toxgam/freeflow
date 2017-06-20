import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import {Circle, Group, Layer, Line, Rect, Stage} from 'react-konva'

import {game1} from './data'

const MyLine = ({points, color, width}) => {
  return (
    <Line
      points={points}
      stroke={color}
      strokeWidth={width}
      lineCap="round"
      lineJoin="round"
    />
  )
}

const MyCircle = ({cellSize, x, y, color}) => {
  return (
    <Circle
      x={x * cellSize + cellSize / 2}
      y={y * cellSize + cellSize / 2}
      radius={cellSize / 3}
      fill={color}
      strokeWidth={4}
    />
  )
}

const getPointIdx = (points, x, y) => {
  for (let idx = 0; idx < points.length; idx += 2) {
    if (points[idx] === x && points[idx + 1] === y) {
      return idx
    }
  }
  return -1
}

const getFixedColor = (fixed, x, y) => {
  const colors = Object.keys(fixed)
  for (const color of colors) {
    const points = fixed[color]
    if (getPointIdx(points, x, y) >= 0) {
      return color
    }
  }
  return undefined
}

const rollBack = (lines, selectedColor, x, y) => {
  let selfRolledBack = false

  const colors = Object.keys(lines)
  colors.forEach(color => {
    const points = lines[color]
    const idx = getPointIdx(points, x, y)

    if (idx >= 0) {
      const sliceIdx = color === selectedColor ? idx + 2 : idx
      lines[color] = points.slice(0, sliceIdx)
      selfRolledBack = color === selectedColor
    }
  })

  return selfRolledBack
}

const isConnected = (fixed, lines) => {
  const colors = Object.keys(fixed)
  for (let i = 0; i < colors.length; i++) {
    const color = colors[i]

    const points = lines[color]
    if (!points) {
      return false
    }

    const connected =
      (
        points[0] === fixed[color][0] &&
        points[1] === fixed[color][1] &&
        points[points.length - 2] === fixed[color][2] &&
        points[points.length - 1] === fixed[color][3]
      ) ||
      (
        points[points.length - 2] === fixed[color][0] &&
        points[points.length - 1] === fixed[color][1] &&
        points[0] === fixed[color][2] &&
        points[1] === fixed[color][3]
      )
    if (!connected) {
      return false
    }
  }
  return true
}

const areAllFilled = (size, lines) => {
  const pointss = Object.values(lines)
  const totalFilled = pointss.reduce(
    (sum, points) => sum + points.length / 2,
    0
  )
  return totalFilled === size * size
}

export default class Board extends Component {
  static route = <Route exact path="/levels/:id" component={Board} />

  state = {
    windowSize: Math.min(window.innerWidth, window.innerHeight),
    size: game1.size,
    fixed: game1.fixed,
    lines: {},
    selectedColor: undefined
  }

  bg = undefined

  onMouseDown = (e) => {
    const cellSize = this.state.windowSize / this.state.size

    const x = Math.floor(e.evt.x / cellSize)
    const y = Math.floor(e.evt.y / cellSize)

    const lines = this.state.lines
    const fixedColor = getFixedColor(this.state.fixed, x, y)

    if (fixedColor) {
      delete lines[fixedColor]
      this.setState({selectedColor: fixedColor, lines})
    } else {
      const colors = Object.keys(lines)
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i]
        const points = lines[color]
        const idx = getPointIdx(points, x, y)
        if (idx >= 0) {
          lines[color] = points.slice(0, idx + 2)
          this.setState({selectedColor: color, lines})
          return
        }
      }
    }
  }

  onMouseUp = (e) => {
    this.setState({selectedColor: undefined})
  }

  onMouseMove = (e) => {
    const cellSize = this.state.windowSize / this.state.size

    const selectedColor = this.state.selectedColor
    if (!selectedColor) {
      return
    }

    const x = Math.floor(e.evt.x / cellSize)
    const y = Math.floor(e.evt.y / cellSize)

    // Stop at fixed point
    const color = getFixedColor(this.state.fixed, x, y)
    if (color !== undefined && color !== selectedColor) {
      this.setState({selectedColor: undefined})
      return
    }

    // Initialize
    const lines = this.state.lines
    if (!lines[selectedColor]) {
      lines[selectedColor] = []
    }

    const points = lines[selectedColor]

    // Roll back uncomplete route
    if (rollBack(lines, selectedColor, x, y)) {
      this.setState({lines})
      return
    }

    // Add points
    const lastX = points[points.length - 2]
    const lastY = points[points.length - 1]
    const lastColor = getFixedColor(this.state.fixed, lastX, lastY)
    if ((lastX === undefined || x === lastX || y === lastY) &&
        (color || !lastColor || points.length <= 2)) {
      points.push(x, y)
      this.setState({lines})
    }

    if (isConnected(this.state.fixed, this.state.lines) &&
        areAllFilled(this.state.size, this.state.lines)) {
      console.log('Done')
    }
  }

  render() {
    const cellSize = this.state.windowSize / this.state.size
    const array = [...Array(this.state.size + 1).keys()]

    return (
      <Stage width={this.state.windowSize} height={this.state.windowSize}>
        <Layer>
          {array.map(idx =>
            <MyLine key={idx}
              points={[0, idx * cellSize, this.state.windowSize, idx * cellSize]}
              color="black"
              width={5}
            />
          )}

          {array.map(idx =>
            <MyLine key={idx}
              points={[idx * cellSize, 0, idx * cellSize, this.state.windowSize]}
              color="black"
              width={5}
            />
          )}

          {Object.keys(this.state.fixed).map((color, idx) => {
            const points = this.state.fixed[color]

            return (
              <Group key={idx}>
                <MyCircle cellSize={cellSize} x={points[0]} y={points[1]} color={color} />
                <MyCircle cellSize={cellSize} x={points[2]} y={points[3]} color={color} />
              </Group>
            )
          })}

          {Object.keys(this.state.lines).map((color, idx) => {
            const points = this.state.lines[color]
            return (
              <MyLine
                key={idx}
                points={points.map(p => p * cellSize + cellSize / 2)}
                color={color}
                width={20}
              />
            )
          })}

          <Rect
            x={0}
            y={0}
            width={this.state.windowSize}
            height={this.state.windowSize}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onMouseMove={this.onMouseMove}
          />
        </Layer>
      </Stage>
    )
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({windowSize: Math.min(window.innerWidth, window.innerHeight)})
    })
  }
}
