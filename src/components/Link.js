import React from 'react'
import { TouchableHighlight, Text } from 'react-native'

export function Link({ children, navigate }) {
  return (
    <TouchableHighlight onPress={navigate}>
      <Text>{children}</Text>
    </TouchableHighlight>
  )
}
