import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

const BUTTON_SIZE = 70

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

const makeStyles = ResponsiveStyleSheet.create(() => ({
  button: {
    padding: 20,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
  },
}))
