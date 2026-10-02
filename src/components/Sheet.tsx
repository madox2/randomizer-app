import React, {ReactNode, useEffect, useRef, useState} from 'react'
import {
  Animated,
  BackHandler,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import {useTheme} from '../theme/colors'
import {useMetrics} from '../theme/metrics'
import {useReduceMotion} from '../utils/motion'

type Props = {
  visible: boolean
  onClose: () => void
  children: ReactNode
}

const USE_NATIVE_DRIVER = Platform.OS !== 'web'

/**
 * Bottom sheet over a dimmed screen. Slides in and out, closes with the
 * backdrop and the hardware back button.
 */
export const Sheet = ({visible, onClose, children}: Props) => {
  const theme = useTheme()
  const {height, insets} = useMetrics()
  const reduceMotion = useReduceMotion()
  const progress = useRef(new Animated.Value(0)).current
  const [mounted, setMounted] = useState(visible)

  useEffect(() => {
    if (visible) {
      setMounted(true)
    }
    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: reduceMotion ? 0 : visible ? 260 : 180,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER,
    })
    animation.start(({finished}) => {
      if (finished && !visible) {
        setMounted(false)
      }
    })
    return () => animation.stop()
  }, [visible, progress, reduceMotion])

  useEffect(() => {
    if (!visible) {
      return
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose()
      return true
    })
    return () => subscription.remove()
  }, [visible, onClose])

  if (!mounted) {
    return null
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {backgroundColor: theme.scrim, opacity: progress},
        ]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close"
        />
      </Animated.View>
      <KeyboardAvoidingView
        style={s.positioner}
        behavior={Platform.OS === 'web' ? undefined : 'padding'}
        pointerEvents="box-none">
        <Animated.View
          style={[
            s.panel,
            {
              backgroundColor: theme.surface,
              paddingBottom: insets.bottom + 20,
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Math.min(height, 600), 0],
                  }),
                },
              ],
            },
          ]}>
          <View style={[s.handle, {backgroundColor: theme.border}]} />
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  )
}

const s = StyleSheet.create({
  positioner: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  panel: {
    width: '100%',
    maxWidth: 480,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
})
