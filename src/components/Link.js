import React from 'react'
import { TouchableHighlight, Text } from 'react-native'

export const Link = ({ children, navigate }) => (
  <TouchableHighlight onPress={navigate}>
    <Text>{children}</Text>
  </TouchableHighlight>
)
