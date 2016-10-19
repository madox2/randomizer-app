import React from 'react'
import { Text, View, TextInput } from 'react-native'

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

const sanitize = n => /^\-?\d+$/.test(n) ? +n : n

const Error = ({ children }) => (
  <Text>{children}</Text>
)

export const InputNumber = ({ label, onChange, value, err, constraints }) => {
  const onChangeText = n => onChange(sanitize(n), validate(sanitize(n), constraints))
  return (
    <View>
      <Text>{label}</Text>
      <TextInput onChangeText={onChangeText} value={`${value}`} />
      {err && (
        <Error>{err}</Error>
      )}
    </View>
  )
}
