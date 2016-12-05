import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

export const ControlButton = ({ onPress, type, backgroundColor }) => {
  const s = makeStyles()
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.button, { backgroundColor }]}
      activeOpacity={0.5}
    >
      <Image source={{ uri: `../resources/icons/${type}.svg` }} />
    </TouchableOpacity>
  )
}

const makeStyles = ResponsiveStyleSheet.create(({ controlButtonSize }) => ({
  button: {
    padding: 20,
    width: controlButtonSize,
    height: controlButtonSize,
    borderRadius: controlButtonSize / 2,
  },
}))
