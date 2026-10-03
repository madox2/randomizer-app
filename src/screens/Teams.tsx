import React, {useEffect, useRef, useState} from 'react'
import {Animated, ScrollView, StyleSheet, Text, View} from 'react-native'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {TeamsSheet} from '../components/TeamsSheet'
import {Touchable} from '../components/Touchable'
import {storage} from '../services/storage'
import {CONTROL_FILL, fonts, ON_COLOR, teamColors} from '../theme/colors'
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
          backgroundColor: color,
          opacity: appear,
          transform: [
            {translateY: appear.interpolate({inputRange: [0, 1], outputRange: [16, 0]})},
          ],
        },
      ]}>
      <Text style={style.teamTitle}>Team {number}</Text>
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

  const onSave = (next: {teams: number; players: string[]}) => {
    storage.set('Teams.count', next.teams)
    storage.set('Teams.players', next.players)
    setTeamCount(next.teams)
    setPlayers(next.players)
    setEditing(false)
    split(next.players, next.teams)
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
      summary={`Teams ${teamCount}  ·  Players ${players.length}`}
      onSettings={() => setEditing(true)}
      overlay={
        <TeamsSheet
          visible={editing}
          teams={teamCount}
          players={players}
          accent={props.color ?? '#444'}
          onSave={onSave}
          onClose={() => setEditing(false)}
        />
      }
      style={s.container}>
      {empty ? (
        <View style={s.empty}>
          <Text style={s.emptyTitle}>Who is playing?</Text>
          <Text style={s.emptyText}>
            Add the names of the players and shuffle them into random teams.
          </Text>
          <Touchable
            onPress={() => setEditing(true)}
            accessibilityLabel="Add players"
            style={s.add}>
            <Text style={s.addText}>Add players</Text>
          </Touchable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.teams}>
          {teams.map((members, i) => (
            <TeamCard
              key={`${round}-${i}`}
              number={i + 1}
              members={members}
              delay={i * 70}
              color={teamColors[i % teamColors.length]}
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
    },
    teamTitle: {
      marginBottom: 10,
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
    add: {
      height: 48,
      marginTop: 24,
      paddingHorizontal: 24,
      borderRadius: 24,
      justifyContent: 'center',
      backgroundColor: CONTROL_FILL,
    },
    addText: {
      color: ON_COLOR,
      fontSize: fonts.size.body,
      fontWeight: fonts.bold,
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
