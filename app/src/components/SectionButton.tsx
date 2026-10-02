import React from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {icons, IconName} from '../resources/images'
import {Metrics, useMetrics} from '../theme/metrics'

type Props = {
  title: string
  onPress: () => void
  color: string
  type: IconName
}

export const SectionButton = ({title, onPress, color, type}: Props) => {
  const s = makeStyles(useMetrics())
  return (
    <TouchableOpacity
      style={[{backgroundColor: color}, s.container]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={s.imageWrapper}>
        <Image style={s.image} source={icons[type]} />
      </View>
      <View style={s.textWrapper}>
        <Text style={s.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const makeStyles = ({
  width,
  height,
  dividerWidth,
  landscape,
  headingFontSize,
}: Metrics) => {
  const buttonWidth = width / 2 - dividerWidth / 2
  const imageHeight = Math.min(150, ((height / 3) * 2) / 3)
  return StyleSheet.create({
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
  })
}
