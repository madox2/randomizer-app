import React from 'react'
import { Text, View, TextInput } from 'react-native'

export const InputText = ({ label, onChange, value, error }) => (
  <View>
    <Text>{label}</Text>
    <TextInput onChangeText={onChange} value={value} />
    {error && (
      <Text>{error}</Text>
    )}
  </View>
)

