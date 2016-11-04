import React from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'

const BUTTON_SIZE = 80

export const ControlButton = ({ onPress, type }) => (
  <TouchableOpacity onPress={onPress} style={s.button} activeOpacity={0.5}>
    <Image source={{ uri: `../resources/icons/${type}.svg` }} />
  </TouchableOpacity>
)

const s = StyleSheet.create({
  button: {
    padding: 20,
    backgroundColor: '#4078c0',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
  },
})
