import React, {useEffect, useRef} from 'react'
import {Animated, Easing, StyleSheet, View} from 'react-native'
import {CoinFace} from '../components/art/game'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {Metrics, useMetrics} from '../theme/metrics'
import {Gesture, USE_NATIVE_DRIVER, usePanResponder} from '../utils/gesture'
import {haptics} from '../utils/haptics'
import {randomBoolean} from '../utils/random'

// scale of the flipped coin (0 does not work properly on android)
const MIN_SCALE = 0.0001

// The coin turns by quarter turns of `rotation` (0 to 4 is one full turn):
// a face is full at 0 (first) and 2 (second) and edge-on at 1 and 3. The
// height of a face follows a cosine so the flip looks like a turning disc.
const QUARTER = 0.25
const squash = (turn: number) =>
  Math.max(Math.abs(Math.cos((turn * Math.PI) / 2)), MIN_SCALE)
const steps = (from: number, to: number) =>
  Array.from({length: Math.round((to - from) / QUARTER) + 1}, (_, i) => from + i * QUARTER)
// first face: visible from 3 to 1 (through 0 and 4), second face: from 1 to 3
const FIRST_FACE = {
  input: [...steps(0, 1), ...steps(3, 4)],
  output: [...steps(0, 1), ...steps(3, 4)].map(squash),
}
const SECOND_FACE = {
  input: [0, ...steps(1, 3), 4],
  output: [MIN_SCALE, ...steps(1, 3).map((t) => squash(t - 2)), MIN_SCALE],
}
// quarter turns of the flight: 4 full turns are slow enough to be followed
const FLIGHT_TURNS = 16
const FLIGHT_DURATION = 900

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

  const computePosition = (y0: number, y: number) =>
    Math.min(lowerPosition, Math.max(upperPosition, y - y0 + initialPosition))

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
      onMove: ({y0, moveY}: Gesture) => {
        if (!animating.current) {
          position.setValue(computePosition(y0, moveY))
        }
      },
      onEnd: () => {
        if (!animating.current) {
          throwCoin()
        }
      },
    },
    {captureStart: true},
  )

  const face = (
    scale: {input: number[]; output: number[]},
    inputOpacity: number[],
  ) => ({
    transform: [
      {
        scaleY: rotation.interpolate({
          inputRange: scale.input,
          outputRange: scale.output,
        }),
      },
    ],
    opacity: rotation.interpolate({
      inputRange: [0, 1, 2, 3, 4],
      outputRange: inputOpacity,
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
              style={[
                s.rotationContainer,
                face(FIRST_FACE, [1, 1, 0, 1, 1]),
              ]}
              {...panResponder.panHandlers}>
              <CoinFace size={imageSize} side="heads" />
            </Animated.View>
            <Animated.View
              style={[
                s.rotationContainer,
                face(SECOND_FACE, [0, 1, 1, 1, 0]),
              ]}
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
