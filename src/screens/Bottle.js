import React, { Component } from 'react'
import { View, PanResponder, Animated, Easing, Image } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

const bottleSource = { uri: '../resources/images/bottle.svg' }

export class Bottle extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      angle: 0,
      rotation: new Animated.Value(0),
      rotating: false,
    }
    this.onBottleLayout = this.onBottleLayout.bind(this)
  }

  computeAngle(x, y) {
    const PADDING_TOP = 0 // FIXME: how to handle absolute vs relative position?
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
    return Math.sign(curr - prev)
  }

  computeVelocity(vx, vy) {
    return Math.sqrt(vx * vx + vy * vy)
  }

  startRotation(velocity, direction) {
    if (this.state.rotating) {
      return
    }
    const { angle } = this.state
    velocity = Math.max(0.1, velocity)
    const duration = Math.sqrt(velocity) * 2500
    const spin = velocity * 5 // TODO: non linear function
    const anim = new Animated.Value(angle)
    const newAngle = Math.floor(direction * 360 * spin)
    Animated.timing(anim, {
      toValue: newAngle,
      duration,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      // FIXME: @see ./Bottle.js
      try {
        this.setState({
          rotation: new Animated.Value(0),
        })
      } catch(e) {
        console.warn(e)
      }
      this.setState({
        rotation: new Animated.Value(0),
        rotating: false,
      })
    })
    this.setState({
      rotation: Animated.modulo(anim, 360),
      rotating: true,
      angle: newAngle,
    })
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
    const { angle, rotating, rotation } = this.state
    const s = makeStyles()
    return (
      <SectionTemplate title='Bottle' color={this.props.color}>
        <View style={s.container} {...this._panResponder.panHandlers}>
          {!rotating &&
            <View
              onLayout={this.onBottleLayout}
              style={{
                transform: [ { rotate: `${angle}deg` } ],
              }}
            >
              <Image source={bottleSource} style={s.image} />
            </View>
          }
          {rotating &&
            <View>
              <Animated.Image source={bottleSource}
                style={[s.image, {
                  transform: [
                    {rotate: rotation.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    })},
                  ],
                }]}
              />
            </View>
          }
        </View>
      </SectionTemplate>
    )
  }

}

const makeStyles = ResponsiveStyleSheet.create(({ width, height }) => ({
  image: {
    height: Math.min(width - 10, height * 2 / 3),
    width: Math.min(width - 10, height * 2 / 3) / 4,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

const createPanResponder = ({ onStart, onMove, onEnd }) => PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onStartShouldSetPanResponderCapture: () => true,
  onPanResponderTerminationRequest: () => true,
  onPanResponderGrant: (evt, state) => onStart(state),
  onPanResponderMove: (evt, state) => onMove(state),
  onPanResponderRelease: (evt, state) => onEnd(state),
})
