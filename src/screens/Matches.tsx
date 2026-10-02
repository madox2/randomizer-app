import React, {useEffect, useRef, useState} from 'react'
import {Animated, Image, Platform, ScrollView, StyleSheet} from 'react-native'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {Options} from '../components/UserOptions'
import {images} from '../resources/images'
import {storage} from '../services/storage'
import {Metrics, useMetrics} from '../theme/metrics'
import {Gesture, USE_NATIVE_DRIVER, usePanResponder} from '../utils/gesture'
import {uniqueRandomNumbers} from '../utils/random'

const MIN_PULL_LENGTH = 10

const validator = (options: Options) =>
  Number(options.burnedCount.value) >= Number(options.count.value)
    ? 'Total count must be greater than count of burned matches'
    : null

type MatchProps = {
  burned: boolean
  lowerPosition: number
  upperPosition: number
  style: ReturnType<typeof makeStyles>
}

const Match = ({burned, lowerPosition, upperPosition, style}: MatchProps) => {
  const [pulled, setPulled] = useState(false)
  const position = useRef(new Animated.Value(lowerPosition)).current

  // keep the match at the right position when the layout changes
  useEffect(() => {
    position.setValue(pulled ? upperPosition : lowerPosition)
  }, [position, pulled, upperPosition, lowerPosition])

  const computePosition = (y0: number, y: number) =>
    Math.min(lowerPosition, Math.max(upperPosition, y - y0 + lowerPosition))

  const panResponder = usePanResponder(
    {
      onMove: ({y0, moveY}: Gesture) => {
        if (!pulled) {
          position.setValue(computePosition(y0, moveY))
        }
      },
      onEnd: ({y0, moveY}: Gesture) => {
        if (pulled) {
          return
        }
        if (computePosition(y0, moveY) > lowerPosition - MIN_PULL_LENGTH) {
          position.setValue(lowerPosition)
          return
        }
        Animated.timing(position, {
          toValue: upperPosition,
          useNativeDriver: USE_NATIVE_DRIVER,
          duration: 200,
        }).start(() => setPulled(true))
      },
    },
    {captureStart: Platform.OS === 'web', captureMove: Platform.OS !== 'web'},
  )

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[style.imageContainer, {transform: [{translateY: position}]}]}>
      <Image
        style={style.imageMatch}
        source={pulled && burned ? images.matchBurned : images.match}
      />
    </Animated.View>
  )
}

export const Matches = (props: SectionProps) => {
  const m = useMetrics()
  const [settings, setSettings] = useState(() => ({
    count: storage.getNumber('Matches.count'),
    burnedCount: storage.getNumber('Matches.burnedCount'),
  }))
  const {count, burnedCount} = settings
  const [burned, setBurned] = useState(() =>
    uniqueRandomNumbers(0, count - 1, burnedCount),
  )
  // changes with every new game to reset the matches
  const [round, setRound] = useState(0)

  const [options] = useState<Options>(() => ({
    count: {
      type: 'number',
      label: 'Count',
      defaultValue: count,
      constraints: {min: 2, max: 50},
    },
    burnedCount: {
      type: 'number',
      label: 'Burned',
      defaultValue: burnedCount,
      constraints: {min: 1, max: 50},
      validator,
    },
  }))

  const {contentHeight, controlsHeight, settingsHeight} = m
  const availableHeight = contentHeight - controlsHeight - settingsHeight
  const matchHeight = Math.min(300, availableHeight * 0.83)
  const pullHeight = Math.min(availableHeight - matchHeight, matchHeight / 4)
  const lowerPosition = -(availableHeight - matchHeight - pullHeight) / 2
  const upperPosition = lowerPosition - pullHeight
  const s = makeStyles(m, matchHeight)

  const onRefresh = () => {
    setBurned(uniqueRandomNumbers(0, count - 1, burnedCount))
    setRound((r) => r + 1)
  }

  const onOptionsChange = ({count: c, burnedCount: b}: Options) => {
    const next = {count: Number(c.value), burnedCount: Number(b.value)}
    storage.set('Matches.count', next.count)
    storage.set('Matches.burnedCount', next.burnedCount)
    setSettings(next)
    setBurned(uniqueRandomNumbers(0, next.count - 1, next.burnedCount))
    setRound((r) => r + 1)
  }

  return (
    <SectionTemplate
      {...props}
      onRefresh={onRefresh}
      options={options}
      onOptionsChange={onOptionsChange}
      style={s.container}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        horizontal>
        {Array.from({length: count}, (_, i) => (
          <Match
            key={`${round}-${i}`}
            burned={burned.includes(i)}
            lowerPosition={lowerPosition}
            upperPosition={upperPosition}
            style={s}
          />
        ))}
      </ScrollView>
    </SectionTemplate>
  )
}

const makeStyles = (
  {contentWidth, controlsHeight, contentPadding}: Metrics,
  matchHeight: number,
) => {
  const matchWidth = matchHeight / 10.14
  const matchPadding = contentWidth * 0.02
  return StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    // fills the screen width so that many matches can be scrolled
    scroll: {
      alignSelf: 'stretch',
    },
    scrollContent: {
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginBottom: controlsHeight - contentPadding,
    },
    imageContainer: {
      paddingLeft: matchPadding,
      paddingRight: matchPadding,
      height: matchHeight,
    },
    imageMatch: {
      position: 'relative',
      resizeMode: 'stretch',
      height: matchHeight,
      width: matchWidth,
      bottom: 0,
    },
  })
}
