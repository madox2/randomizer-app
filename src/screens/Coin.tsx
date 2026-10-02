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
  // the coin moves within the whole screen, the same as before the redesign
  const contentHeight = m.height - 2 * m.contentPadding
  const controlsHeight = 100
  const imageSize = Math.min(contentHeight * 0.5, 200)
  const upperPosition = -contentHeight / 2 + imageSize / 2
  const lowerPosition = contentHeight / 2 - imageSize / 2 - controlsHeight / 3
  const initialPosition = lowerPosition * 0.3
  const s = makeStyles(imageSize)

  const time = useRef(new Animated.Value(0)).current
  const rotation = useRef(Animated.modulo(time, 4)).current
  const position = useRef(new Animated.Value(initialPosition)).current
  const animating = useRef(false)

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
    time.setValue(0)
    Animated.parallel([
      Animated.timing(time, {
        toValue: 30 + (randomBoolean() ? 0 : 2),
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

  return (
    <SectionTemplate {...props}>
      <View style={s.container}>
        <Animated.View
          style={[s.positionContainer, {transform: [{translateY: position}]}]}>
          <Animated.View
            style={[
              s.rotationContainer,
              face([1, MIN_SCALE, MIN_SCALE, MIN_SCALE, 1], [1, 1, 0, 1, 1]),
            ]}
            {...panResponder.panHandlers}>
            <CoinFace size={imageSize} side="crown" />
          </Animated.View>
          <Animated.View
            style={[
              s.rotationContainer,
              face([MIN_SCALE, MIN_SCALE, 1, MIN_SCALE, MIN_SCALE], [0, 1, 1, 1, 0]),
            ]}
            {...panResponder.panHandlers}>
            <CoinFace size={imageSize} side="eagle" />
          </Animated.View>
        </Animated.View>
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
