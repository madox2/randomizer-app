import React from 'react'
import {Image, StyleSheet, TouchableOpacity} from 'react-native'
import {icons, IconName} from '../resources/images'
import {Metrics, useMetrics} from '../theme/metrics'

type Props = {
  onPress: () => void
  type: IconName
  backgroundColor?: string
}

export const ControlButton = ({onPress, type, backgroundColor}: Props) => {
  const s = makeStyles(useMetrics())
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.button, {backgroundColor}]}
      activeOpacity={0.8}>
      <Image source={icons[type]} style={s.image} />
    </TouchableOpacity>
  )
}

const makeStyles = ({controlButtonSize}: Metrics) => {
  const padding = 20
  return StyleSheet.create({
    button: {
      padding,
      width: controlButtonSize,
      height: controlButtonSize,
      borderRadius: controlButtonSize / 2,
    },
    image: {
      width: controlButtonSize - 2 * padding,
      height: controlButtonSize - 2 * padding,
    },
  })
}
