import React from 'react'
import {TouchableOpacity, Text, Image, View} from 'react-native'
import {ResponsiveStyleSheet} from 'react-native-responsive-stylesheet'
import {resource} from '../utils/image'

export const SectionButton = ({title, onPress, color, type}) => {
  const s = makeStyles()
  const container = [{backgroundColor: color}, s.container]
  return (
    <TouchableOpacity style={container} onPress={onPress} activeOpacity={0.8}>
      <View style={s.imageWrapper}>
        <View>
          <Image style={s.image} source={resource(`icons/${type}.png`)} />
        </View>
      </View>
      <View style={s.textWrapper}>
        <Text style={s.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const makeStyles = ResponsiveStyleSheet.create(
  ({width, height, dividerWidth, landscape, headingFontSize}) => {
    const buttonWidth = width / 2 - dividerWidth / 2
    const imageHeight = Math.min(150, ((height / 3) * 2) / 3)
    return {
      container: {
        flex: 1,
        flexDirection: landscape ? 'row' : 'column',
        width: buttonWidth,
      },
      imageWrapper: {
        flex: landscape ? undefined : 4,
        width: landscape ? buttonWidth / 2 : undefined,
        alignItems: 'center',
        justifyContent: 'center',
      },
      image: {
        height: imageHeight,
        width: imageHeight,
      },
      textWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        color: 'white',
        fontSize: headingFontSize,
        paddingBottom: 10,
        paddingLeft: 10,
      },
    }
  },
)
