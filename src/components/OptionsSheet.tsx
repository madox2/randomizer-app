import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {fonts, useTheme} from '../theme/colors'
import {NumberConstraints} from '../utils/validate'
import {Button} from './Button'
import {InputNumber} from './InputNumber'
import {Sheet} from './Sheet'

export type NumberOption = {
  label: string
  /** current value */
  value: number
  constraints?: NumberConstraints
  /** Validation of the option in the context of all options. */
  validator?: (values: Record<string, number>) => string | null
}

/** Options of a section, displayed in the order of the keys. */
export type Options = Record<string, NumberOption>

export const optionsSummary = (options: Options): string =>
  Object.values(options)
    .map(({label, value}) => `${label} ${value}`)
    .join('  ·  ')

type Field = {
  value: number | string
  err: string | null
  /** error of the validator of the whole form, cleared by a change */
  customErr: string | null
}

type Props = {
  visible: boolean
  title: string
  accent: string
  options: Options
  onSave: (values: Record<string, number>) => void
  onClose: () => void
}

const initialFields = (options: Options): Record<string, Field> =>
  Object.fromEntries(
    Object.entries(options).map(([key, {value}]) => [
      key,
      {value, err: null, customErr: null},
    ]),
  )

/** Form to change the options of a section. */
export const OptionsSheet = ({
  visible,
  title,
  accent,
  options,
  onSave,
  onClose,
}: Props) => {
  const theme = useTheme()
  const [fields, setFields] = useState(() => initialFields(options))

  // start from the current values every time the form is opened
  useEffect(() => {
    if (visible) {
      setFields(initialFields(options))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onInputChange = (key: string, value: number | string, err: string | null) =>
    setFields((current) => ({
      ...current,
      [key]: {value, err, customErr: null},
    }))

  const save = () => {
    const values = Object.fromEntries(
      Object.entries(fields).map(([key, {value}]) => [key, Number(value)]),
    )
    const validated = Object.fromEntries(
      Object.entries(fields).map(([key, field]) => {
        const customErr = options[key].validator?.(values) ?? null
        return [key, {...field, err: field.err || customErr, customErr}]
      }),
    )
    if (Object.values(validated).some(({err}) => err)) {
      setFields(validated)
      return
    }
    onSave(values)
  }

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={[s.title, {color: theme.text}]}>{title}</Text>
      {Object.entries(options).map(([key, option], i) => (
        <InputNumber
          key={key}
          label={option.label}
          value={fields[key]?.value ?? option.value}
          err={fields[key]?.err}
          constraints={option.constraints}
          accent={accent}
          autoFocus={i === 0}
          onChange={(value, err) => onInputChange(key, value, err)}
          onSubmitEditing={save}
        />
      ))}
      <View style={s.buttons}>
        <Button variant="text" onPress={onClose}>
          Cancel
        </Button>
        <Button color={accent} onPress={save} style={s.save}>
          Save
        </Button>
      </View>
    </Sheet>
  )
}

const s = StyleSheet.create({
  title: {
    fontSize: fonts.size.title,
    fontWeight: fonts.bold,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  save: {
    minWidth: 120,
  },
})
