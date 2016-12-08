import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'
import { resource } from '../utils/image'

export const ControlButton = ({ onPress, type, backgroundColor }) => {
  const s = makeStyles()
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.button, { backgroundColor }]}
      activeOpacity={0.5}
    >
      <Image source={resource(`icons/${type}.png`)} style={s.image} />
    </TouchableOpacity>
  )
}

const makeStyles = ResponsiveStyleSheet.create(({ controlButtonSize }) => {
  const padding = 20
  return {
    button: {
      padding: padding,
      width: controlButtonSize,
      height: controlButtonSize,
      borderRadius: controlButtonSize / 2,
    },
    image: {
      width: controlButtonSize - 2 * padding,
      height: controlButtonSize - 2 * padding,
    },
  }
})
