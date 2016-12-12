import React from 'react'
import { TouchableHighlight, Text, StyleSheet } from 'react-native'

export const Button = ({ children, onPress, style }) => (
  <TouchableHighlight onPress={onPress} style={[styles.button, style]} underlayColor='#ddd'>
    <Text style={styles.label}>{children}</Text>
  </TouchableHighlight>
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
  label: {
    fontSize: 18,
  },
})
