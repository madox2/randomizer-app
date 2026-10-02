import React from 'react'
import {TouchableHighlight, Text} from 'react-native'

export const Link = ({children, navigate, style}) => (
  <TouchableHighlight onPress={navigate} style={style}>
    <Text>{children}</Text>
  </TouchableHighlight>
)
