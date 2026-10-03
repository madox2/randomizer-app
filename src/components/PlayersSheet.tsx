import React, {useEffect, useState} from 'react'
import {Platform, StyleSheet, Text, TextInput, View} from 'react-native'
import {fonts, useTheme} from '../theme/colors'
import {formatPlayers, parsePlayers} from '../utils/teams'
import {Button} from './Button'
import {Sheet} from './Sheet'

type Props = {
  visible: boolean
  players: string[]
  accent: string
  onSave: (players: string[]) => void
  onClose: () => void
}

/** Form to edit the list of players, one name per line. */
export const PlayersSheet = ({visible, players, accent, onSave, onClose}: Props) => {
  const theme = useTheme()
  const [text, setText] = useState(() => formatPlayers(players))
  const [focused, setFocused] = useState(false)

  // start from the current players every time the form is opened
  useEffect(() => {
    if (visible) {
      setText(formatPlayers(players))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const count = parsePlayers(text).length

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={[s.title, {color: theme.text}]}>Players</Text>
      <Text style={[s.label, {color: theme.textMuted}]}>
        One name per line  ·  {count} {count === 1 ? 'player' : 'players'}
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        autoFocus={false}
        accessibilityLabel="Players"
        placeholder={'Anna\nBen\nCleo\nDan'}
        placeholderTextColor={theme.textMuted}
        selectionColor={accent}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          s.input,
          {
            color: theme.text,
            backgroundColor: theme.inputBg,
            borderColor: focused ? accent : 'transparent',
          },
        ]}
      />
      <View style={s.buttons}>
        <Button variant="text" onPress={onClose}>
          Cancel
        </Button>
        <Button color={accent} onPress={() => onSave(parsePlayers(text))} style={s.save}>
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
    marginBottom: 12,
  },
  label: {
    fontSize: fonts.size.caption,
    fontWeight: fonts.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    height: 180,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
    fontSize: fonts.size.body + 2,
    fontWeight: fonts.semibold,
    textAlignVertical: 'top',
    ...Platform.select({web: {outlineStyle: 'none'} as object}),
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
