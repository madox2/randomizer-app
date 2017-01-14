import React from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import { resource } from '../utils/image'

export const InfoButton = ({ onPress, type, backgroundColor }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.button, { backgroundColor }]}
      activeOpacity={0.8}
    >
      <Image source={resource(`icons/${type}.png`)} style={s.image} resizeMode='contain' />
    </TouchableOpacity>
  )
}

const PADDING = 4
const SIZE = 38
const s = StyleSheet.create({
  button: {
    padding: PADDING,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
  image: {
    width: SIZE - 2 * PADDING,
    height: SIZE - 2 * PADDING,
  },
})
