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
            <Text style={s.dismiss}>dismiss...</Text>
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    options: {
      position: 'absolute',
      top: insets.top + contentPadding / 2 + INFO_BUTTON_SIZE,
      right: insets.right + contentPadding / 2,
      maxWidth: Math.min(width - contentPadding, 340),
      backgroundColor: 'white',
      borderRadius: 20,
      borderTopRightRadius: 0,
      elevation: 5,
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
    },
    option: {
      padding: 13,
      paddingTop: 18,
    },
    text: {
      textAlign: 'center',
      lineHeight: 24,
      fontSize: 16,
    },
    dismiss: {
      marginTop: 20,
      lineHeight: 24,
      fontSize: 16,
      textAlign: 'right',
      color: '#6495ed',
    },
  })
