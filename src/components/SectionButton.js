import React from 'react'
import { TouchableHighlight, Text, View, StyleSheet } from 'react-native'

export const SectionButton = ({ title, onPress, color }) => (
  <TouchableHighlight style={container(color)} onPress={onPress}>
    <Text>{title}</Text>
  </TouchableHighlight>
)

const container = backgroundColor => ([
  s.container, { backgroundColor },
])

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
})
