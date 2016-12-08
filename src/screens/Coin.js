import React, { Component } from 'react'
import { Platform, Image, PanResponder, Animated, Easing, View } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { randomNumber } from '../utils/random'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'
import { resource } from '../utils/image'

const coin0 = resource('images/coin0.png')
//const coin1 = resource('images/coin1.png')

// FIXME:
// rotation on android has large perspective which was not possible to adjust
// skewX works the same way as rotateX on web, which is bug but sufficient for now:
// https://productpains.com/post/react-native/transform-skewy-isnt-working-properly
const rotationTransformKey = Platform.OS === 'web' ? 'rotateX' : 'skewX'

export class Coin extends Component {

  constructor(...args) {
    super(...args)
    this.throwCoin = this.throwCoin.bind(this)
    this.time = new Animated.Value(0)
    this.rotation = Animated.modulo(this.time, 2)
    this.position = new Animated.Value(this.prevPosition)
    this.onLayout = this.onLayout.bind(this)
  }

  onLayout(l) {
    this.layout = l.nativeEvent.layout
  }

  computePosition(y0, y) {
    let pos = y - y0 + this.prevPosition
    pos < this.upperPosition && (pos = this.upperPosition)
    pos > this.lowerPosition && (pos = this.lowerPosition)
    return pos
  }

  updateCoinProperties() {
    const { contentHeight, controlsHeight } = ResponsiveStyleSheet.getProperties()
    this.imageSize = Math.min(contentHeight * 0.5, 200)
    this.upperPosition = -contentHeight / 2 + this.imageSize / 2
    this.lowerPosition = contentHeight / 2 - this.imageSize / 2 - controlsHeight / 3
    this.initialPosition = this.lowerPosition * 0.3
    this.prevPosition = this.initialPosition
    this.position = new Animated.Value(this.prevPosition)
  }

  componentWillUpdate() {
    this.updateCoinProperties()
  }

  componentWillMount() {
    this.updateCoinProperties()
    this._panResponder = createPanResponder({
      onStart: () => {
      },
      onMove: state => {
        if (this.animating) {
          return
        }
        const position = this.computePosition(state.y0, state.moveY)
        this.position.setValue(position)
      },
      onEnd: state => {
        if (this.animating) {
          return
        }
        this.prevPosition = this.computePosition(state.y0, state.moveY)
        this.throwCoin()
      },
    })
  }

  throwCoin() {
    this.animating = true
    this.time.setValue(0)
    this.prevPosition = this.initialPosition
    Animated.parallel([
      Animated.timing(this.time, {
        toValue: 15 + randomNumber(0, 1),
        duration: 800,
        easing: Easing.linear,
      }),
      Animated.sequence([
        Animated.timing(this.position, {
          delay: 0,
          toValue: this.upperPosition,
          duration: 400,
          easing: Easing.bezier(0.19, 1, 0.22, 1),
        }),
        Animated.timing(this.position, {
          delay: 0,
          toValue: this.initialPosition,
          duration: 400,
          easing: Easing.bezier(0.95, 0.05, 0.795, 0.035),
        }),
      ]),
    ]).start(() => {
      this.animating = false
    })
  }

  render() {
    const s = makeStyles({ imageSize: this.imageSize })
    return (
      <SectionTemplate
        title='Coin'
        color={this.props.color}
        buttonColor={this.props.buttonColor}
      >
        <View style={s.container}>
          <Animated.View
            style={[s.animationContainer, {
              transform: [
                {translateY: this.position},
                {[rotationTransformKey]: this.rotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                })},
              ],
            }]}
            onLayout={this.onLayout}
            {...this._panResponder.panHandlers}
          >
            <Image source={coin0} style={s.image} />
          </Animated.View>
        </View>
      </SectionTemplate>
    )
  }

}

const createPanResponder = ({ onStart, onMove, onEnd }) => PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onStartShouldSetPanResponderCapture: () => true,
  onPanResponderTerminationRequest: () => true,
  onPanResponderGrant: (evt, state) => onStart(state),
  onPanResponderMove: (evt, state) => onMove(state),
  onPanResponderRelease: (evt, state) => onEnd(state),
})

// TODO: backfaceVisibility is not supported by android now
// implement coin animation using two images when it is supported
// https://productpains.com/post/react-native/android-backfacevisibility-not-working
const makeStyles = ResponsiveStyleSheet.create(({ imageSize }) => {
  return {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: imageSize,
      height: imageSize,
    },
    animationContainer: {
      height: imageSize,
      width: imageSize,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      top: 0,
    },
  }
})
