import React from 'react'
import {StyleSheet, Text, TextInput, View} from 'react-native'
import {NumberConstraints, sanitize, validate} from '../utils/validate'

type Props = {
  label: string
  value: number | string
  err?: string | null
  constraints?: NumberConstraints
  onChange: (value: number | string, err: string | null) => void
  onSubmitEditing?: () => void
}

export const InputNumber = ({
  label,
  onChange,
  value,
  err,
  constraints,
  onSubmitEditing,
}: Props) => {
  const onChangeText = (text: string) => {
    const n = sanitize(text)
    onChange(n, validate(n, constraints))
  }
  return (
    <View style={s.container}>
      <Text style={s.label}>{`${label}:`}</Text>
      <TextInput
        onChangeText={onChangeText}
        value={`${value}`}
        style={s.input}
        keyboardType="numeric"
        onSubmitEditing={onSubmitEditing}
      />
      {!!err && <Text style={s.error}>{err}</Text>}
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10,
    margin: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 0,
    color: 'gray',
    padding: 5,
    fontSize: 18,
  },
  error: {
    fontSize: 16,
    color: 'red',
    padding: 5,
  },
})
