import React from 'react'
import {StyleSheet} from 'react-native'
import {CONTROL_FILL} from '../theme/colors'
import {UiIcon, UiIconName} from './art/icons'
import {Touchable} from './Touchable'

export const ICON_BUTTON_SIZE = 48

type Props = {
  icon: UiIconName
  label: string
  onPress: () => void
  disabled?: boolean
}

/** Round flat button with an icon, meant to be placed over a section color. */
export const IconButton = ({icon, label, onPress, disabled}: Props) => (
  <Touchable
    onPress={onPress}
    disabled={disabled}
    accessibilityLabel={label}
    style={[s.button, disabled && s.disabled]}>
    <UiIcon name={icon} size={24} />
  </Touchable>
)

const s = StyleSheet.create({
  button: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    borderRadius: ICON_BUTTON_SIZE / 2,
    backgroundColor: CONTROL_FILL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
})
