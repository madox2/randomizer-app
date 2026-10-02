import React, {useCallback, useEffect, useState} from 'react'
import {Platform, StyleSheet, Text} from 'react-native'
import {storage} from '../services/storage'
import {fonts, useTheme} from '../theme/colors'
import {Button} from './Button'
import {Sheet} from './Sheet'

/**
 * Controls the info sheet. The sheet is displayed automatically only the first
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
  title: string
  accent: string
  visible: boolean
  onDismiss: () => void
}

export const InfoSheet = ({type, title, accent, visible, onDismiss}: Props) => {
  const theme = useTheme()
  return (
    <Sheet visible={visible} onClose={onDismiss}>
      <Text style={[s.title, {color: theme.text}]}>{title}</Text>
      <Text style={[s.text, {color: theme.textMuted}]}>
        {storage.get(`Info.${type}`)}
      </Text>
      <Button color={accent} onPress={onDismiss}>
        Got it
      </Button>
    </Sheet>
  )
}

const s = StyleSheet.create({
  title: {
    fontSize: fonts.size.title,
    fontWeight: fonts.bold,
    marginBottom: 8,
  },
  text: {
    fontSize: fonts.size.body,
    lineHeight: 24,
    marginBottom: 24,
  },
})
