import React, {useCallback, useEffect, useRef} from 'react'
import {Animated, Easing, StyleSheet, View} from 'react-native'
import {BottleArt} from '../components/art/game'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {Metrics, useMetrics} from '../theme/metrics'
import {
  DRAG_AREA_STYLE,
  Gesture,
  USE_NATIVE_DRIVER,
  usePanResponder,
} from '../utils/gesture'
import {haptics} from '../utils/haptics'

// difference of two angles normalized to the range (-180, 180]
const angleDiff = (a: number, b: number) => ((((a - b) % 360) + 540) % 360) - 180

const velocityOf = (vx: number, vy: number) => Math.sqrt(vx * vx + vy * vy)

export const Bottle = (props: SectionProps) => {
  const s = makeStyles(useMetrics())
  const angle = useRef(new Animated.Value(0)).current
  const rotation = useRef(Animated.modulo(angle, 360)).current
  const bottle = useRef<View>(null)
  // center of the bottle in the window coordinates
  const center = useRef({x: 0, y: 0})
  // difference between the bottle angle and the finger angle when grabbed,
  // so the bottle does not jump to point at the finger
  const grabOffset = useRef(0)
  // the angle of the bottle, a natively animated value can not be read directly
  const currentAngle = useRef(0)

  useEffect(() => {
    const id = angle.addListener(({value}) => {
      currentAngle.current = value
    })
    return () => angle.removeListener(id)
  }, [angle])

  const measure = useCallback(() => {
    bottle.current?.measureInWindow((x, y, width, height) => {
      center.current = {x: x + width / 2, y: y + height / 2}
    })
  }, [])

  const computeAngle = (x: number, y: number) => {
    const dx = x - center.current.x
    const dy = -(y - center.current.y)
    return (Math.atan2(dx, dy) * 180) / Math.PI
  }

  const startRotation = (velocity: number, direction: number, from: number) => {
    if (velocity < 0.1) {
      return
    }
    const duration = Math.sqrt(velocity) * 2500
    const spin = velocity * 5
    Animated.timing(angle, {
      toValue: from + Math.floor(direction * 360 * spin),
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start(({finished}) => finished && haptics.tap())
  }

  const panResponder = usePanResponder(
    {
      onStart: ({x0, y0}: Gesture) => {
        measure()
        // stops a running spin, the bottle is grabbed at the angle it stopped at
        angle.stopAnimation()
        grabOffset.current = currentAngle.current - computeAngle(x0, y0)
      },
      // The position of the finger is taken from its movement (dx, dy), the
      // absolute position of a move (moveX, moveY) is not always valid.
      onMove: ({x0, y0, dx, dy}: Gesture) => {
        angle.setValue(computeAngle(x0 + dx, y0 + dy) + grabOffset.current)
      },
      onEnd: ({x0, y0, dx, dy, vx, vy}: Gesture) => {
        const x = x0 + dx
        const y = y0 + dy
        const direction = Math.sign(
          angleDiff(computeAngle(x, y), computeAngle(x - vx, y - vy)),
        )
        startRotation(velocityOf(vx, vy), direction, currentAngle.current)
      },
    },
    {captureStart: true, allowTermination: false},
  )

  return (
    <SectionTemplate {...props}>
      <View
        style={[s.container, DRAG_AREA_STYLE]}
        onLayout={measure}
        {...panResponder.panHandlers}
        collapsable={false}>
        <Animated.View
          ref={bottle}
          onLayout={measure}
          style={{
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}>
          <BottleArt width={s.image.width} height={s.image.height} />
        </Animated.View>
      </View>
    </SectionTemplate>
  )
}

const makeStyles = ({contentWidth, contentHeight}: Metrics) => {
  const height = Math.min(contentWidth, contentHeight, 440)
  return StyleSheet.create({
    image: {
      width: height / 4,
      height,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
}
