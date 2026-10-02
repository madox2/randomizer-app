import React, {ReactNode} from 'react'
import {Platform, Pressable, StyleProp, StyleSheet, Text, ViewStyle} from 'react-native'

type Props = {
  children: ReactNode
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

export const Button = ({children, onPress, style}: Props) => (
  <Pressable
    onPress={onPress}
    android_ripple={{color: '#ddd'}}
    style={({pressed}) => [
      styles.button,
      style,
      pressed && Platform.OS !== 'android' && styles.pressed,
    ]}>
    <Text style={styles.label}>{children}</Text>
  </Pressable>
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
  pressed: {
    backgroundColor: '#ddd',
  },
  label: {
    fontSize: 18,
  },
})
