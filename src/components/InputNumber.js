import React from 'react'
import { Text, View, TextInput } from 'react-native'

export const InputNumber = ({ label, onChange, value, error }) => (
  <View>
    <Text>{label}</Text>
    <TextInput onChangeText={(n) => onChange(+n)} value={`${value}`} />
    {error && (
      <Text>{error}</Text>
    )}
  </View>
)

