import React from 'react'
import { View } from 'react-native'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

export const Modal = ({ children }) => (
  <View style={styles()}>{children}</View>
)

const styles = ResponsiveStyleSheet.create(({ width, height }) => ({
  width, height,
}))
