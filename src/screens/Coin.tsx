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
    const turns = 32 + (randomBoolean() ? 0 : 2)
    Animated.parallel([
      Animated.timing(time, {
        toValue: restingTime.current + turns,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.sequence([
        Animated.timing(position, {
          toValue: upperPosition,
          duration: 400,
          easing: Easing.bezier(0.19, 1, 0.22, 1),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(position, {
          toValue: initialPosition,
          duration: 400,
          easing: Easing.bezier(0.95, 0.05, 0.795, 0.035),
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

  const face = (inputScale: number[], inputOpacity: number[]) => ({
    transform: [
      {
        scaleY: rotation.interpolate({
          inputRange: [0, 1, 2, 3, 4],
          outputRange: inputScale,
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
                face([1, MIN_SCALE, MIN_SCALE, MIN_SCALE, 1], [1, 1, 0, 1, 1]),
              ]}
              {...panResponder.panHandlers}>
              <CoinFace size={imageSize} side="heads" />
            </Animated.View>
            <Animated.View
              style={[
                s.rotationContainer,
                face([MIN_SCALE, MIN_SCALE, 1, MIN_SCALE, MIN_SCALE], [0, 1, 1, 1, 0]),
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
