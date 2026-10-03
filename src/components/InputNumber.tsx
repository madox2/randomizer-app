import React from 'react'
import {StyleSheet, Text, TextInput, View} from 'react-native'
import {palette, radius} from '../theme/palette'
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
      <Text style={s.label}>{label}</Text>
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
    padding: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: palette.surface,
    borderRadius: radius.medium,
    borderWidth: 1.5,
    borderColor: palette.border,
    color: palette.text,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 22,
    fontWeight: '600',
  },
  error: {
    fontSize: 15,
    color: palette.error,
    paddingTop: 8,
    paddingLeft: 4,
  },
})
