import React from 'react'
import { Text, View, TextInput } from 'react-native'

export const InputNumber = ({ label, onChange, value }) => (
  <View>
    <Text>{label}</Text>
    <TextInput onChangeText={(n) => onChange(+n)} value={`${value}`} />
  </View>
)

