import React, {useEffect, useRef, useState} from 'react'
import {Animated, Platform, ScrollView, StyleSheet} from 'react-native'
import {MatchArt} from '../components/art/game'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {Options} from '../components/OptionsSheet'
import {storage} from '../services/storage'
import {Metrics, useMetrics} from '../theme/metrics'
import {
  DRAG_AREA_STYLE,
  Gesture,
  USE_NATIVE_DRIVER,
  usePanResponder,
} from '../utils/gesture'
import {haptics} from '../utils/haptics'
import {uniqueRandomNumbers} from '../utils/random'

const MIN_PULL_LENGTH = 10

const validator = (values: Record<string, number>) =>
  values.burnedCount >= values.count
    ? 'Count must be greater than the number of burned matches'
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

  // by the movement of the finger (dy), the absolute position of a move is not
  // always valid
  const computePosition = (dy: number) =>
    Math.min(lowerPosition, Math.max(upperPosition, dy + lowerPosition))

  const panResponder = usePanResponder(
    {
      onMove: ({dy}: Gesture) => {
        if (!pulled) {
          position.setValue(computePosition(dy))
        }
      },
      onEnd: ({dy}: Gesture) => {
        if (pulled) {
          return
        }
        if (computePosition(dy) > lowerPosition - MIN_PULL_LENGTH) {
          position.setValue(lowerPosition)
          return
        }
        Animated.timing(position, {
          toValue: upperPosition,
          useNativeDriver: USE_NATIVE_DRIVER,
          duration: 200,
        }).start(() => {
          setPulled(true)
          if (burned) {
            haptics.warning()
          } else {
            haptics.tap()
          }
        })
      },
    },
    {captureStart: Platform.OS === 'web', captureMove: Platform.OS !== 'web'},
  )

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        style.imageContainer,
        DRAG_AREA_STYLE,
        {transform: [{translateY: position}]},
      ]}>
      <MatchArt
        width={style.imageMatch.width}
        height={style.imageMatch.height}
        burned={pulled && burned}
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

  const options: Options = {
    count: {label: 'Count', value: count, constraints: {min: 2, max: 50}},
    burnedCount: {
      label: 'Burned',
      value: burnedCount,
      constraints: {min: 1, max: 50},
      validator,
    },
  }

  const availableHeight = m.contentHeight
  const matchHeight = Math.min(300, availableHeight * 0.83)
  const pullHeight = Math.min(availableHeight - matchHeight, matchHeight / 4)
  const lowerPosition = -(availableHeight - matchHeight - pullHeight) / 2
  const upperPosition = lowerPosition - pullHeight
  const s = makeStyles(m, matchHeight)

  const onRefresh = () => {
    setBurned(uniqueRandomNumbers(0, count - 1, burnedCount))
    setRound((r) => r + 1)
  }

  const onOptionsChange = (values: Record<string, number>) => {
    const next = {count: values.count, burnedCount: values.burnedCount}
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
  {contentWidth}: Metrics,
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
