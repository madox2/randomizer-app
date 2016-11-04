import React, { Component } from 'react'
import { View, PanResponder } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

export class Bottle extends Component {

  constructor(...args) {
    super(...args)
    this.state = { angle: 0, rotating: false }
    this.onBottleLayout = this.onBottleLayout.bind(this)
  }

  computeAngle(x, y) {
    const PADDING_TOP = 60 // FIXME: how to handle absolute vs relative position?
    const mx = this.bottleLayout.x + this.bottleLayout.width / 2
    const my = (this.bottleLayout.y + PADDING_TOP) + this.bottleLayout.height / 2
    const dx = x - mx
    const dy = -(y - my)
    const rad = Math.atan2(dx, dy)
    return rad * 180 / Math.PI
  }

  computeDirection(x, y, vx, vy) {
    const curr = this.computeAngle(x, y)
    const prev = this.computeAngle(x - vx, y - vy)
    return Math.sign(prev - curr)
  }

  computeVelocity(vx, vy) {
    return Math.sqrt(vx * vx + vy * vy)
  }

  startRotation(velocity, direction) {
    // TODO: tune parameters for touch events
    const duration = Math.sqrt(velocity) * 2000
    const angleStep = Math.sqrt(velocity) * 15
    const timeStep = 20
    this.setState({ rotating: true })
    // TODO: non linear funciton
    const f = t => angleStep * t / duration - angleStep
    let time = 0
    this.rotation = setInterval(() => {
      this.setState({ angle: this.state.angle + direction * f(time) })
      time += timeStep
      if (time > duration) {
        clearInterval(this.rotation)
        this.setState({ rotating: false })
      }
    }, timeStep)
  }

  componentWillMount() {
    this._panResponder = createPanResponder({
      onStart: state => {
        this.rotation && clearInterval(this.rotation)
        this.setState({
          angle: this.computeAngle(state.x0, state.y0),
          rotating: false,
        })
      },
      onMove: state => this.setState({
        angle: this.computeAngle(state.moveX, state.moveY),
      }),
      onEnd: state => {
        const velocity = this.computeVelocity(state.vx, state.vy)
        const direction = this.computeDirection(state.moveX, state.moveY, state.vx, state.vy)
        this.startRotation(velocity, direction)
      },
    })
  }

  componentWillUnmount() {
    this.rotation && clearInterval(this.rotation)
  }

  onBottleLayout(l) {
    this.bottleLayout = l.nativeEvent.layout
  }

  render() {
    const s = makeStyles()
    return (
      <SectionTemplate title='Bottle'>
        <View style={s.container} {...this._panResponder.panHandlers}>
          <BottleItem
            angle={this.state.angle}
            size={s.bottleItem.size}
            onLayout={this.onBottleLayout}
          />
        </View>
      </SectionTemplate>
    )
  }

}

const makeStyles = ResponsiveStyleSheet.create(({ width, height }) => ({
  bottleItem: {
    size: Math.min(width, height * 2 / 3),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

const BottleItem = ({ angle, size, onLayout }) => (
  <View style={{
      backgroundColor: 'red',
      borderTopWidth: 20,
      borderTopColor: 'blue',
      width: 3,
      height: size,
      transform: [ { rotate: `${angle}deg` } ],
    }}
    onLayout={onLayout}
  ></View>
)

const createPanResponder = ({ onStart, onMove, onEnd }) => PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onStartShouldSetPanResponderCapture: () => true,
  onPanResponderTerminationRequest: () => true,
  onPanResponderGrant: (evt, state) => onStart(state),
  onPanResponderMove: (evt, state) => onMove(state),
  onPanResponderRelease: (evt, state) => onEnd(state),
})
