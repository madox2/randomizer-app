import React from 'react'
import { TouchableOpacity, Text, Image, View } from 'react-native'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

export const SectionButton = ({ title, onPress, color, type }) => {
  const s = makeStyles()
  const container = [
    { backgroundColor: color },
    s.container,
  ]
  return (
    <TouchableOpacity style={container} onPress={onPress} activeOpacity={0.5}>
      <View style={s.imageWrapper}>
        <View>
          <Image style={s.image} source={{ uri: `../resources/icons/${type}.svg` }} />
        </View>
      </View>
      <Text style={s.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const makeStyles = ResponsiveStyleSheet.create(({ width, height, dividerWidth }) => ({
  container: {
    flex: 1,
    width: width / 2 - dividerWidth / 2,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: Math.min(150, (height / 3) * 2 / 3),
  },
  text: {
    color: 'white',
    fontSize: 18,
    paddingBottom: 10,
    paddingLeft: 10,
  },
}))
