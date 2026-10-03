import React, {useEffect, useRef, useState} from 'react'
import {Animated, ScrollView, StyleSheet, Text, View} from 'react-native'
import {UiIcon} from '../components/art/icons'
import {Options} from '../components/OptionsSheet'
import {PlayersSheet} from '../components/PlayersSheet'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {Touchable} from '../components/Touchable'
import {storage} from '../services/storage'
import {CONTROL_FILL, fonts, ON_COLOR} from '../theme/colors'
import {Metrics, useMetrics} from '../theme/metrics'
import {USE_NATIVE_DRIVER} from '../utils/gesture'
import {haptics} from '../utils/haptics'
import {useReduceMotion} from '../utils/motion'
import {splitIntoTeams} from '../utils/teams'

const MIN_TEAM_WIDTH = 150
const TEAM_GAP = 12

const loadPlayers = (): string[] => {
  try {
    const players = JSON.parse(storage.get('Teams.players'))
    return Array.isArray(players) ? players.filter((p) => typeof p === 'string') : []
  } catch {
    return []
  }
}

type TeamCardProps = {
  number: number
  members: string[]
  delay: number
  color: string
  style: ReturnType<typeof makeStyles>
}

const TeamCard = ({number, members, delay, color, style}: TeamCardProps) => {
  const reduceMotion = useReduceMotion()
  const appear = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current

  useEffect(() => {
    if (reduceMotion) {
      appear.setValue(1)
      return
    }
    const animation = Animated.timing(appear, {
      toValue: 1,
      duration: 260,
      delay,
      useNativeDriver: USE_NATIVE_DRIVER,
    })
    animation.start()
    return () => animation.stop()
  }, [appear, delay, reduceMotion])

  return (
    <Animated.View
      accessible
      accessibilityLabel={`Team ${number}: ${members.join(', ')}`}
      style={[
        style.team,
        {
          opacity: appear,
          transform: [
            {translateY: appear.interpolate({inputRange: [0, 1], outputRange: [16, 0]})},
          ],
        },
      ]}>
      <View style={style.teamHeader}>
        <View style={style.badge}>
          <Text style={[style.badgeText, {color}]}>{number}</Text>
        </View>
        <Text style={style.teamTitle}>Team {number}</Text>
      </View>
      {members.map((name, i) => (
        <Text key={`${name}-${i}`} style={style.member} numberOfLines={1}>
          {name}
        </Text>
      ))}
    </Animated.View>
  )
}

export const Teams = (props: SectionProps) => {
  const m = useMetrics()
  const [teamCount, setTeamCount] = useState(() => storage.getNumber('Teams.count'))
  const [players, setPlayers] = useState(loadPlayers)
  const [teams, setTeams] = useState(() => splitIntoTeams(players, teamCount))
  // changes with every shuffle to replay the appearance of the teams
  const [round, setRound] = useState(0)
  const [editing, setEditing] = useState(false)
  const s = makeStyles(m)

  const split = (nextPlayers: string[], nextCount: number) => {
    setTeams(splitIntoTeams(nextPlayers, nextCount))
    setRound((r) => r + 1)
  }

  const options: Options = {
    teams: {label: 'Teams', value: teamCount, constraints: {min: 2, max: 20}},
  }

  const onOptionsChange = (values: Record<string, number>) => {
    storage.set('Teams.count', values.teams)
    setTeamCount(values.teams)
    split(players, values.teams)
  }

  const onPlayersSave = (next: string[]) => {
    storage.set('Teams.players', next)
    setPlayers(next)
    setEditing(false)
    split(next, teamCount)
    haptics.tap()
  }

  const onRefresh = () => {
    haptics.tap()
    split(players, teamCount)
  }

  const empty = players.length < 2
  const hint = empty ? 'Add at least two players' : 'Tap Shuffle to mix the teams again'

  return (
    <SectionTemplate
      {...props}
      hint={hint}
      refreshLabel="Shuffle"
      onRefresh={empty ? undefined : onRefresh}
      options={options}
      onOptionsChange={onOptionsChange}
      overlay={
        <PlayersSheet
          visible={editing}
          players={players}
          accent={props.color ?? '#444'}
          onSave={onPlayersSave}
          onClose={() => setEditing(false)}
        />
      }
      style={s.container}>
      <View style={s.header}>
        <Touchable
          onPress={() => setEditing(true)}
          accessibilityLabel={`Edit players, ${players.length} so far`}
          style={s.edit}>
          <UiIcon name="edit" size={18} />
          <Text style={s.editText}>
            {players.length === 0
              ? 'Add players'
              : `${players.length} ${players.length === 1 ? 'player' : 'players'}`}
          </Text>
        </Touchable>
      </View>
      {empty ? (
        <View style={s.empty}>
          <Text style={s.emptyTitle}>Who is playing?</Text>
          <Text style={s.emptyText}>
            Add the names of the players and shuffle them into random teams.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.teams}>
          {teams.map((members, i) => (
            <TeamCard
              key={`${round}-${i}`}
              number={i + 1}
              members={members}
              delay={i * 70}
              color={props.color ?? '#444'}
              style={s}
            />
          ))}
        </ScrollView>
      )}
    </SectionTemplate>
  )
}

const makeStyles = ({contentPadding, contentWidth}: Metrics) => {
  // teams of the same width, as many columns as fit
  const columns = Math.max(1, Math.floor((contentWidth + TEAM_GAP) / (MIN_TEAM_WIDTH + TEAM_GAP)))
  const teamWidth = (contentWidth - TEAM_GAP * (columns - 1)) / columns
  return StyleSheet.create({
    container: {
      paddingHorizontal: contentPadding,
    },
    header: {
      alignItems: 'center',
      paddingBottom: 12,
    },
    edit: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 40,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: CONTROL_FILL,
    },
    editText: {
      marginLeft: 8,
      color: ON_COLOR,
      fontSize: fonts.size.body,
      fontWeight: fonts.bold,
    },
    teams: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: TEAM_GAP,
      paddingBottom: 12,
    },
    team: {
      width: teamWidth,
      padding: 16,
      borderRadius: 20,
      backgroundColor: CONTROL_FILL,
    },
    teamHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    badge: {
      width: 28,
      height: 28,
      marginRight: 10,
      borderRadius: 14,
      backgroundColor: ON_COLOR,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      fontSize: fonts.size.caption + 1,
      fontWeight: fonts.bold,
    },
    teamTitle: {
      color: ON_COLOR,
      fontSize: fonts.size.title,
      fontWeight: fonts.bold,
    },
    member: {
      color: ON_COLOR,
      fontSize: fonts.size.body + 1,
      lineHeight: 26,
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingBottom: 48,
    },
    emptyTitle: {
      color: ON_COLOR,
      fontSize: fonts.size.heading,
      fontWeight: fonts.bold,
      marginBottom: 8,
    },
    emptyText: {
      color: ON_COLOR,
      fontSize: fonts.size.body,
      textAlign: 'center',
      opacity: 0.85,
    },
  })
}
