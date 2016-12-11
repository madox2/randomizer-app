import React from 'react'
import { View, TouchableNativeFeedback, Text, StyleSheet } from 'react-native'

export const Button = ({ children, onPress, style }) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.SelectableBackground()}
  >
    <View style={[styles.button, style]}>
      <Text>{children}</Text>
    </View>
  </TouchableNativeFeedback>
)

const styles = StyleSheet.create({
  button: {
    padding: 14,
    paddingRight: 20,
    paddingLeft: 20,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'silver',
  },
})
