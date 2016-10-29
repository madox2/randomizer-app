import React, { Component } from 'react'
import { View, PanResponder } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { randomNumber } from '../utils/random'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

export class Bottle extends Component {

  constructor(...args) {
    super(...args)
    this.state = { angle: 0, rotating: false }
    this.onFire = this.onFire.bind(this)
    this.onReset = this.onReset.bind(this)
    this.onBottleLayout = this.onBottleLayout.bind(this)
  }

  onFire() {
    const angle = randomNumber(0, 360)
    this.setState({ angle })
  }

  onReset() {
    this.setState({ angle: 0 })
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

  startRotation() {
    // TODO: compute velocity
    this.setState({ rotating: true })
    const step = 20, duration = 3000, angleStep = 33
    // TODO: non linear funciton
    const f = t => angleStep * t / duration - angleStep
    let time = 0
    // TODO: use animation frame instead?
    const rotation = setInterval(() => {
      this.setState({ angle: this.state.angle + f(time) })
      time += step
      if (time > duration) {
        clearInterval(rotation)
        this.setState({ rotating: false })
      }
    }, step)
  }

  componentWillMount() {
    // TODO: cancel rotation
    this._panResponder = createPanResponder({
      onStart: state => this.setState({
        angle: this.computeAngle(state.x0, state.y0),
      }),
      onMove: state => this.setState({
        angle: this.computeAngle(state.moveX, state.moveY),
      }),
      onEnd: state => {
        const velocity = Math.sqrt(state.vx * state.vx + state.vy * state.vy)
        this.startRotation(velocity)
      },
    })
  }

  onBottleLayout(l) {
    this.bottleLayout = l.nativeEvent.layout
  }

  render() {
    const s = makeStyles()
    return (
      <SectionTemplate onFire={this.onFire} onReset={this.onReset} title='Bottle'>
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
