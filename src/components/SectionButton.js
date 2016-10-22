import React from 'react'
import { TouchableOpacity, Text, Image } from 'react-native'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

export const SectionButton = ({ title, onPress, color, uri }) => {
  const s = makeStyles()
  const container = [
    { backgroundColor: color },
    s.container,
  ]
  return (
    <TouchableOpacity style={container} onPress={onPress} activeOpacity={0.5}>
      <Image style={s.image} source={{ uri }} />
      <Text>{title}</Text>
    </TouchableOpacity>
  )
}

const makeStyles = ResponsiveStyleSheet.create(({ width, height }) => ({
  container: {
    flex: 1,
    width: width / 2,
  },
  image: {
    height: Math.min(150, (height / 3) * 2 / 3),
  },
}))
