import React, { Component } from 'react'
import { PanResponder, Animated, Easing, View } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { randomNumber } from '../utils/random'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

// TODO: responsive coin position
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
    return y - y0 + this.prevPosition
  }

  updateCoinProperties() {
    const { contentPadding, contentHeight } = ResponsiveStyleSheet.getProperties()
    this.imageSize = contentHeight * 0.55
    this.upperPosition = -this.imageSize / 2 + contentPadding
    this.lowerPosition = this.imageSize / 2
    this.initialPosition = this.imageSize / 4
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
        // TODO: how to grab coin during animation
        const position = this.computePosition(state.y0, state.moveY)
        if (position < this.upperPosition) {
          return this.position.setValue(this.upperPosition)
        }
        if (position > this.lowerPosition) {
          return this.position.setValue(this.lowerPosition)
        }
        this.position.setValue(position)
      },
      onEnd: state => {
        this.prevPosition = this.computePosition(state.y0, state.moveY)
        this.throwCoin()
      },
    })
  }

  throwCoin() {
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
    ]).start()
  }

  render() {
    const s = makeStyles({ imageSize: this.imageSize })
    return (
      <SectionTemplate
        title='Coin'
        color={this.props.color}
      >
        <View style={s.container}>
          <View style={s.imageContainer}>
            <Animated.View
              style={[s.positionContainer, {
                top: this.position,
              }]}
              onLayout={this.onLayout}
              {...this._panResponder.panHandlers}
            >
              <Animated.Image
                source={{ uri: '../resources/images/coin0.svg' }}
                style={[s.image, {
                  transform: [
                    {rotateX: this.rotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    })},
                  ],
                }]}
              />
              <Animated.Image
                source={{ uri: '../resources/images/coin1.svg' }}
                style={[s.image, {
                  transform: [
                    {rotateX: this.rotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['180deg', '0deg'],
                    })},
                  ],
                }]}
              />
            </Animated.View>
          </View>
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

const makeStyles = ResponsiveStyleSheet.create(({ imageSize, contentHeight }) => {
  // TODO: fix responsive stylesheet
  imageSize = contentHeight * 0.55
  return {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: imageSize,
      height: imageSize,
      backfaceVisibility: 'hidden',
      position: 'absolute',
    },
    imageContainer: {
      height: imageSize,
      width: imageSize,
    },
    positionContainer: {
      position: 'relative',
      width: imageSize,
      height: imageSize,
    },
  }
})
