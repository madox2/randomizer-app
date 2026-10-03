import React, {useEffect, useRef} from 'react'
import {Animated, Easing, StyleSheet, View} from 'react-native'
import {CoinFace} from '../components/art/game'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {Metrics, useMetrics} from '../theme/metrics'
import {
  DRAG_AREA_STYLE,
  Gesture,
  USE_NATIVE_DRIVER,
  usePanResponder,
} from '../utils/gesture'
import {haptics} from '../utils/haptics'
import {randomBoolean} from '../utils/random'

// The coin turns by quarter turns of `rotation` (0 to 4 is one full turn): the
// first face is full at 0, the second at 2, both are at their thinnest at 1
// and 3. A flat disc seen exactly edge-on vanishes, which looks like a blink
// every half turn. The coin is never thinner than EDGE, like a coin tilted
// in perspective, and the faces change at the thinnest point.
const EDGE = 0.16
const QUARTER = 0.25
const squash = (turn: number) =>
  Math.max(Math.abs(Math.cos((turn * Math.PI) / 2)), EDGE)
const steps = (from: number, to: number) =>
  Array.from(
    {length: Math.round((to - from) / QUARTER) + 1},
    (_, i) => from + i * QUARTER,
  )
// a hair after the turn, to switch the faces in one step
const AFTER = 0.0001
// the first face is shown from 3 to 1 (through 0 and 4), the second from 1 to 3
const FIRST_FACE = {
  height: {
    input: [...steps(0, 1), ...steps(3, 4)],
    output: [...steps(0, 1), ...steps(3, 4)].map(squash),
  },
  visible: {input: [0, 1, 1 + AFTER, 3 - AFTER, 3, 4], output: [1, 1, 0, 0, 1, 1]},
}
const SECOND_FACE = {
  height: {
    input: [0, ...steps(1, 3), 4],
    output: [EDGE, ...steps(1, 3).map((t) => squash(t - 2)), EDGE],
  },
  visible: {input: [0, 1 - AFTER, 1, 3, 3 + AFTER, 4], output: [0, 0, 1, 1, 0, 0]},
}
// 3 full turns in a flight are slow enough to follow, faster turns blur into
// a flicker
// movement of a finger (px) which is a drag, not a tap
const DRAG_SLOP = 6
const FLIGHT_TURNS = 12
const FLIGHT_DURATION = 1000

export const Coin = (props: SectionProps) => {
  const m = useMetrics()
  const {contentHeight} = m
  const imageSize = Math.min(contentHeight * 0.45, 200)
  const upperPosition = -contentHeight / 2 + imageSize / 2 + 8
  const lowerPosition = contentHeight / 2 - imageSize / 2 - 24
  const initialPosition = lowerPosition * 0.3
  const s = makeStyles(imageSize)

  const time = useRef(new Animated.Value(0)).current
  const rotation = useRef(Animated.modulo(time, 4)).current
  const position = useRef(new Animated.Value(initialPosition)).current
  const animating = useRef(false)
  // visible face between throws: 0 or 2 (the quarter turns of `time`)
  const restingTime = useRef(0)

  useEffect(() => {
    if (!animating.current) {
      position.setValue(initialPosition)
    }
  }, [position, initialPosition])

  // Follows the finger by its movement (dy). The absolute position of a move
  // (moveY) is not always valid and would send the coin to the top.
  const computePosition = (dy: number) =>
    Math.min(lowerPosition, Math.max(upperPosition, initialPosition + dy))

  const throwCoin = () => {
    animating.current = true
    haptics.tap()
    // spin on from the current face, resetting `time` would flip the coin
    // to the first face for a frame
    const turns = FLIGHT_TURNS + (randomBoolean() ? 0 : 2)
    Animated.parallel([
      Animated.timing(time, {
        toValue: restingTime.current + turns,
        duration: FLIGHT_DURATION,
        easing: Easing.linear,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.sequence([
        Animated.timing(position, {
          toValue: upperPosition,
          // slows down while rising, like a thrown object
          duration: FLIGHT_DURATION / 2,
          easing: Easing.out(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(position, {
          toValue: initialPosition,
          // and speeds up while falling
          duration: FLIGHT_DURATION / 2,
          easing: Easing.in(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    ]).start(() => {
      animating.current = false
      // the same face, the value is kept small
      restingTime.current = (restingTime.current + turns) % 4
      time.setValue(restingTime.current)
      haptics.thud()
    })
  }

  const panResponder = usePanResponder(
    {
      onMove: ({dy}: Gesture) => {
        // a tap wobbles a little, the coin moves only when it is dragged
        if (!animating.current && Math.abs(dy) > DRAG_SLOP) {
          position.setValue(computePosition(dy))
        }
      },
      onEnd: () => {
        if (!animating.current) {
          throwCoin()
        }
      },
      onTerminate: () => {
        if (!animating.current) {
          position.setValue(initialPosition)
        }
      },
    },
    {captureStart: true, allowTermination: false},
  )

  const face = (shape: typeof FIRST_FACE) => ({
    transform: [
      {
        scaleY: rotation.interpolate({
          inputRange: shape.height.input,
          outputRange: shape.height.output,
        }),
      },
    ],
    opacity: rotation.interpolate({
      inputRange: shape.visible.input,
      outputRange: shape.visible.output,
    }),
  })

  // the shadow on the ground shrinks and fades while the coin is in the air
  const shadowScale = position.interpolate({
    inputRange: [upperPosition, initialPosition],
    outputRange: [0.4, 1],
    extrapolate: 'clamp',
  })

  return (
    <SectionTemplate {...props}>
      <View style={s.container}>
        <View style={s.stage}>
          <Animated.View
            style={[
              s.shadow,
              {
                opacity: shadowScale,
                transform: [{translateY: initialPosition}, {scaleX: shadowScale}],
              },
            ]}
          />
          <Animated.View
            style={[s.positionContainer, {transform: [{translateY: position}]}]}>
            <Animated.View
              style={[s.rotationContainer, DRAG_AREA_STYLE, face(FIRST_FACE)]}
              {...panResponder.panHandlers}>
              <CoinFace size={imageSize} side="heads" />
            </Animated.View>
            <Animated.View
              style={[s.rotationContainer, DRAG_AREA_STYLE, face(SECOND_FACE)]}
              {...panResponder.panHandlers}>
              <CoinFace size={imageSize} side="tails" />
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    </SectionTemplate>
  )
}

// backfaceVisibility is not supported on android, the coin is flipped by
// scaling two images instead
const makeStyles = (imageSize: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stage: {
      width: imageSize,
      height: imageSize,
    },
    shadow: {
      position: 'absolute',
      top: imageSize + 12,
      alignSelf: 'center',
      width: imageSize * 0.8,
      height: imageSize * 0.1,
      borderRadius: imageSize,
      backgroundColor: 'rgba(0, 0, 0, 0.14)',
    },
    positionContainer: {
      height: imageSize,
      width: imageSize,
      position: 'relative',
    },
    rotationContainer: {
      height: imageSize,
      width: imageSize,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
    },
  })
