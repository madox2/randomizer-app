import React, {ReactNode, useRef} from 'react'
import {
  Animated,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'

type Props = Omit<PressableProps, 'style' | 'children'> & {
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  /** layout of the pressable area itself, e.g. `flex` */
  outerStyle?: StyleProp<ViewStyle>
  /** scale of the pressed state, 1 disables the scaling */
  pressedScale?: number
  /** called with the underlying view, e.g. to measure it */
  viewRef?: React.Ref<View>
}

const USE_NATIVE_DRIVER = Platform.OS !== 'web'

/**
 * Pressable with the one press feedback used by the whole app: the element
 * shrinks slightly and gets dimmed while it is pressed.
 */
export const Touchable = ({
  children,
  style,
  outerStyle,
  pressedScale = 0.96,
  viewRef,
  onPressIn,
  onPressOut,
  ...rest
}: Props) => {
  const pressed = useRef(new Animated.Value(0)).current
  const animate = (toValue: number) =>
    Animated.timing(pressed, {
      toValue,
      duration: toValue ? 70 : 140,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start()
  return (
    <Pressable
      ref={viewRef}
      style={outerStyle}
      accessibilityRole="button"
      {...rest}
      onPressIn={(e) => {
        animate(1)
        onPressIn?.(e)
      }}
      onPressOut={(e) => {
        animate(0)
        onPressOut?.(e)
      }}>
      <Animated.View
        style={[
          style,
          {
            opacity: pressed.interpolate({inputRange: [0, 1], outputRange: [1, 0.8]}),
            transform: [
              {
                scale: pressed.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, pressedScale],
                }),
              },
            ],
          },
        ]}>
        {children}
      </Animated.View>
    </Pressable>
  )
}
