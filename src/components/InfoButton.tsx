import React from 'react'
import {Image, StyleSheet, TouchableOpacity} from 'react-native'
import {icons, IconName} from '../resources/images'

type Props = {
  onPress: () => void
  type: IconName
  backgroundColor?: string
}

export const InfoButton = ({onPress, type, backgroundColor}: Props) => (
  <TouchableOpacity
    onPress={onPress}
    style={[s.button, {backgroundColor}]}
    activeOpacity={0.8}>
    <Image source={icons[type]} style={s.image} resizeMode="contain" />
  </TouchableOpacity>
)

const PADDING = 4
export const INFO_BUTTON_SIZE = 38
const s = StyleSheet.create({
  button: {
    padding: PADDING,
    width: INFO_BUTTON_SIZE,
    height: INFO_BUTTON_SIZE,
    borderRadius: INFO_BUTTON_SIZE / 2,
  },
  image: {
    width: INFO_BUTTON_SIZE - 2 * PADDING,
    height: INFO_BUTTON_SIZE - 2 * PADDING,
  },
})
