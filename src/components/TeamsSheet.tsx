import React, {useEffect, useRef, useState} from 'react'
import {Platform, StyleSheet, Text, TextInput, View} from 'react-native'
import {fonts, useTheme} from '../theme/colors'
import {formatPlayers, parsePlayers} from '../utils/teams'
import {NumberConstraints, validate} from '../utils/validate'
import {Button} from './Button'
import {InputNumber} from './InputNumber'
import {Sheet} from './Sheet'

export const TEAM_CONSTRAINTS: NumberConstraints = {min: 2, max: 20}

type Props = {
  visible: boolean
  teams: number
  players: string[]
  accent: string
  onSave: (settings: {teams: number; players: string[]}) => void
  onClose: () => void
}

/** Form to change the number of teams and the list of players (one name per line). */
export const TeamsSheet = ({visible, teams, players, accent, onSave, onClose}: Props) => {
  const theme = useTheme()
  const [teamsValue, setTeamsValue] = useState<number | string>(teams)
  const [teamsErr, setTeamsErr] = useState<string | null>(null)
  const [text, setText] = useState(() => formatPlayers(players))
  const [focused, setFocused] = useState(false)
  const firstInput = useRef<TextInput>(null)

  // start from the current settings every time the form is opened
  useEffect(() => {
    if (visible) {
      setTeamsValue(teams)
      setTeamsErr(null)
      setText(formatPlayers(players))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const names = parsePlayers(text)

  const save = () => {
    const err = validate(teamsValue, TEAM_CONSTRAINTS)
    if (err) {
      setTeamsErr(err)
      return
    }
    onSave({teams: Number(teamsValue), players: names})
  }

  return (
    // focusing while the sheet is still off screen would scroll the page
    <Sheet visible={visible} onClose={onClose} onOpened={() => firstInput.current?.focus()}>
      <Text style={[s.title, {color: theme.text}]}>Teams</Text>
      <InputNumber
        ref={firstInput}
        label="Teams"
        value={teamsValue}
        err={teamsErr}
        constraints={TEAM_CONSTRAINTS}
        accent={accent}
        onChange={(value, err) => {
          setTeamsValue(value)
          setTeamsErr(err)
        }}
      />
      <Text style={[s.label, {color: theme.textMuted}]}>
        Players  ·  one name per line  ·  {names.length}
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
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
  label: {
    fontSize: fonts.size.caption,
    fontWeight: fonts.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    height: 140,
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
