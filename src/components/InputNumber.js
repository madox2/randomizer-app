import React from 'react'
import {Text, View, TextInput, StyleSheet} from 'react-native'

export const validate = (value, constraints = {}) => {
  const {
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
  } = constraints
  if (value === '') return `Cannot be empty`
  if (!Number.isSafeInteger(value)) return `Invalid number format`
  if (value < min) return `Minimum value is ${min}`
  if (value > max) return `Maximum value is ${max}`
  return null
}

const length = (x) => `${x}`.length

const sanitize = (n) =>
  /^\-?\d+$/.test(n) && length(n) === length(+n) ? +n : n

const Error = ({children}) => <Text style={s.error}>{children}</Text>

export const InputNumber = ({
  label,
  onChange,
  value,
  err,
  constraints,
  onSubmitEditing,
}) => {
  const onChangeText = (n) =>
    onChange(sanitize(n), validate(sanitize(n), constraints))
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
      {err && <Error>{err}</Error>}
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
    width: 70,
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
