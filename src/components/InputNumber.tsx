import React, {useState} from 'react'
import {Platform, StyleSheet, Text, TextInput, View} from 'react-native'
import {fonts, useTheme} from '../theme/colors'
import {NumberConstraints, sanitize, validate} from '../utils/validate'

type Props = {
  label: string
  value: number | string
  err?: string | null
  constraints?: NumberConstraints
  accent: string
  autoFocus?: boolean
  onChange: (value: number | string, err: string | null) => void
  onSubmitEditing?: () => void
}

export const InputNumber = ({
  label,
  onChange,
  value,
  err,
  constraints,
  accent,
  autoFocus,
  onSubmitEditing,
}: Props) => {
  const theme = useTheme()
  const [focused, setFocused] = useState(false)
  const onChangeText = (text: string) => {
    const n = sanitize(text)
    onChange(n, validate(n, constraints))
  }
  return (
    <View style={s.container}>
      <Text style={[s.label, {color: theme.textMuted}]}>{label}</Text>
      <TextInput
        onChangeText={onChangeText}
        value={`${value}`}
        accessibilityLabel={label}
        style={[
          s.input,
          {
            color: theme.text,
            backgroundColor: theme.inputBg,
            borderColor: err ? theme.danger : focused ? accent : 'transparent',
          },
        ]}
        keyboardType="numeric"
        selectionColor={accent}
        selectTextOnFocus
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={onSubmitEditing}
      />
      {!!err && <Text style={[s.error, {color: theme.danger}]}>{err}</Text>}
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: fonts.size.caption,
    fontWeight: fonts.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 2,
    fontSize: fonts.size.title,
    fontWeight: fonts.semibold,
    ...Platform.select({web: {outlineStyle: 'none'} as object}),
  },
  error: {
    fontSize: 14,
    marginTop: 6,
  },
})
