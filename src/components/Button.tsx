import React, {ReactNode} from 'react'
import {Platform, Pressable, StyleProp, StyleSheet, Text, ViewStyle} from 'react-native'
import {palette, radius} from '../theme/palette'

type Props = {
  children: ReactNode
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  /** filled (primary) or outlined (secondary) */
  primary?: boolean
}

export const Button = ({children, onPress, style, primary}: Props) => (
  <Pressable
    onPress={onPress}
    style={({pressed}) => [
      styles.button,
      primary ? styles.primary : styles.secondary,
      style,
      pressed && Platform.OS !== 'android' && styles.pressed,
    ]}>
    <Text style={[styles.label, primary && styles.primaryLabel]}>{children}</Text>
  </Pressable>
)

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.medium,
  },
  primary: {
    backgroundColor: palette.accent,
  },
  secondary: {
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: palette.border,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: palette.text,
  },
  primaryLabel: {
    color: palette.surface,
  },
})
