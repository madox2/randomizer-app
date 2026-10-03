import React from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {icons, IconName} from '../resources/images'
import {Metrics, useMetrics} from '../theme/metrics'
import {radius} from '../theme/palette'

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
      activeOpacity={0.85}>
      <View style={s.imageWrapper}>
        <Image style={s.image} source={icons[type]} resizeMode="contain" />
      </View>
      <View style={s.textWrapper}>
        <Text style={s.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const makeStyles = ({height, landscape, headingFontSize}: Metrics) => {
  const imageHeight = Math.min(130, ((height / 3) * 2) / 3)
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: landscape ? 'row' : 'column',
      borderRadius: radius.large,
      overflow: 'hidden',
    },
    imageWrapper: {
      flex: landscape ? 1 : 4,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: landscape ? 0 : 8,
    },
    image: {
      height: imageHeight,
      width: imageHeight,
    },
    textWrapper: {
      flex: landscape ? 1 : undefined,
      minHeight: landscape ? undefined : 52,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: 'white',
      fontSize: headingFontSize,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
  })
}
