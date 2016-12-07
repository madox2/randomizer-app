import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

const sources = {
  'back': require('../resources/icons/back.png'),
  'refresh': require('../resources/icons/refresh.png'),
  'settings': require('../resources/icons/settings.png'),
}

export const ControlButton = ({ onPress, type, backgroundColor }) => {
  const s = makeStyles()
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.button, { backgroundColor }]}
      activeOpacity={0.5}
    >
      <Image source={sources[type]} style={s.image} />
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
