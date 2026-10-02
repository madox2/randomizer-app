import React, {ReactNode} from 'react'
import {StyleProp, StyleSheet, Text, ViewStyle} from 'react-native'
import {fonts, ON_COLOR, useTheme} from '../theme/colors'
import {Touchable} from './Touchable'

type Props = {
  children: ReactNode
  onPress: () => void
  /** `primary` is filled with the accent color, `text` has no background */
  variant?: 'primary' | 'text'
  color?: string
  style?: StyleProp<ViewStyle>
}

export const Button = ({
  children,
  onPress,
  variant = 'primary',
  color,
  style,
}: Props) => {
  const theme = useTheme()
  const primary = variant === 'primary'
  return (
    <Touchable
      onPress={onPress}
      style={[s.button, primary && {backgroundColor: color}, style]}>
      <Text style={[s.label, {color: primary ? ON_COLOR : theme.textMuted}]}>
        {children}
      </Text>
    </Touchable>
  )
}

const s = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: fonts.bold,
  },
})
