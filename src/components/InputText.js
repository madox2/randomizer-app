import React from 'react'
import { Text, View, TextInput } from 'react-native'

export const InputText = ({ label, onChange, value }) => (
  <View>
    <Text>{label}</Text>
    <TextInput onChangeText={onChange} value={value} />
  </View>
)

