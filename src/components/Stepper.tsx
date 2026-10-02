import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {CONTROL_FILL, fonts, ON_COLOR} from '../theme/colors'
import {IconButton} from './IconButton'

type Props = {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

/** Inline − / + control to change a number without opening the settings. */
export const Stepper = ({label, value, min, max, onChange}: Props) => (
  <View style={s.container}>
    <IconButton
      icon="minus"
      label={`Decrease ${label}`}
      disabled={value <= min}
      onPress={() => onChange(value - 1)}
    />
    <Text style={s.value} accessibilityLabel={`${value} ${label}`}>
      {`${value} ${label}`}
    </Text>
    <IconButton
      icon="plus"
      label={`Increase ${label}`}
      disabled={value >= max}
      onPress={() => onChange(value + 1)}
    />
  </View>
)

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
    backgroundColor: CONTROL_FILL,
    padding: 4,
  },
  value: {
    minWidth: 96,
    textAlign: 'center',
    color: ON_COLOR,
    fontSize: fonts.size.body,
    fontWeight: fonts.bold,
  },
})
