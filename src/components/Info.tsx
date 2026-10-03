import React, {useCallback, useEffect, useState} from 'react'
import {
  BackHandler,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {storage} from '../services/storage'
import {Metrics, useMetrics} from '../theme/metrics'
import {palette, radius} from '../theme/palette'
import {INFO_BUTTON_SIZE} from './InfoButton'

/**
 * Controls the info popup. The popup is displayed automatically only the first
 * time (and after the info text was changed in a new version) on native platforms.
 */
export const useInfoPopup = (type: string) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissedVersion = storage.getNumber(`Info.${type}.dismissedVersion`)
    const currentVersion = storage.getNumber(`Info.${type}@version`)
    if (dismissedVersion === currentVersion || Platform.OS === 'web') {
      return
    }
    const frame = requestAnimationFrame(() => {
      setVisible(true)
      storage.set(`Info.${type}.dismissedVersion`, currentVersion)
    })
    return () => cancelAnimationFrame(frame)
  }, [type])

  const show = useCallback(() => setVisible(true), [])
  const hide = useCallback(() => setVisible(false), [])
  return {visible, show, hide}
}

type Props = {
  type: string
  onDismiss: () => void
}

export const InfoPopup = ({type, onDismiss}: Props) => {
  const m = useMetrics()
  const s = makeStyles(m)

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onDismiss()
      return true
    })
    return () => subscription.remove()
  }, [onDismiss])

  return (
    <Pressable style={s.backdrop} onPress={onDismiss}>
      <View style={s.options}>
        <Pressable style={s.option}>
          <Text style={s.text}>{storage.get(`Info.${type}`)}</Text>
          <TouchableOpacity onPress={onDismiss}>
            <Text style={s.dismiss}>Got it</Text>
          </TouchableOpacity>
        </Pressable>
      </View>
    </Pressable>
  )
}

const makeStyles = ({width, insets, contentPadding}: Metrics) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(20, 22, 26, 0.45)',
    },
    options: {
      position: 'absolute',
      top: insets.top + contentPadding / 2 + INFO_BUTTON_SIZE,
      right: insets.right + contentPadding / 2,
      maxWidth: Math.min(width - contentPadding, 340),
      backgroundColor: palette.surface,
      borderRadius: radius.medium,
      borderTopRightRadius: 6,
    },
    option: {
      padding: 20,
    },
    text: {
      lineHeight: 24,
      fontSize: 16,
      color: palette.text,
    },
    dismiss: {
      marginTop: 16,
      lineHeight: 24,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'right',
      color: palette.text,
    },
  })
