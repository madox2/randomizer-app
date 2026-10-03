import React, {useEffect, useRef, useState} from 'react'
import {Animated, Pressable, StyleSheet} from 'react-native'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {Options} from '../components/OptionsSheet'
import {storage} from '../services/storage'
import {fonts, ON_COLOR} from '../theme/colors'
import {Metrics, useMetrics} from '../theme/metrics'
import {USE_NATIVE_DRIVER} from '../utils/gesture'
import {haptics} from '../utils/haptics'
import {randomNumber} from '../utils/random'

type Phase = 'idle' | 'running' | 'stopping'

const TICK = 90
// delays between the last numbers, the generator slows down before it stops
const SLOW_DOWN = [110, 150, 210, 300]

export const Numbers = (props: SectionProps) => {
  const [range, setRange] = useState(() => ({
    from: storage.getNumber('Numbers.from'),
    to: storage.getNumber('Numbers.to'),
  }))
  const {from, to} = range
  const [number, setNumber] = useState(() => randomNumber(from, to))
  const [phase, setPhase] = useState<Phase>('idle')
  const pop = useRef(new Animated.Value(1)).current
  const s = makeStyles(useMetrics(), from, to)

  useEffect(() => {
    if (phase === 'running') {
      const interval = setInterval(() => setNumber(randomNumber(from, to)), TICK)
      return () => clearInterval(interval)
    }
    if (phase === 'stopping') {
      let delay = 0
      const timers = SLOW_DOWN.map((step, i) => {
        delay += step
        return setTimeout(() => {
          setNumber(randomNumber(from, to))
          if (i === SLOW_DOWN.length - 1) {
            setPhase('idle')
            haptics.success()
            Animated.sequence([
              Animated.timing(pop, {toValue: 1.1, duration: 110, useNativeDriver: USE_NATIVE_DRIVER}),
              Animated.spring(pop, {toValue: 1, friction: 4, useNativeDriver: USE_NATIVE_DRIVER}),
            ]).start()
          }
        }, delay)
      })
      return () => timers.forEach(clearTimeout)
    }
  }, [phase, from, to, pop])

  const onPress = () => {
    if (phase === 'idle') {
      haptics.tap()
      setPhase('running')
    } else if (phase === 'running') {
      setPhase('stopping')
    }
  }

  const options: Options = {
    from: {label: 'From', value: from},
    to: {
      label: 'To',
      value: to,
      validator: (values) =>
        values.from > values.to ? 'From has to be less than To' : null,
    },
  }

  const onOptionsChange = (values: Record<string, number>) => {
    const next = {from: values.from, to: values.to}
    storage.set('Numbers.from', next.from)
    storage.set('Numbers.to', next.to)
    setNumber(randomNumber(next.from, next.to))
    setRange(next)
  }

  return (
    <SectionTemplate
      {...props}
      hint={phase === 'idle' ? 'Tap to roll' : 'Tap to stop'}
      options={options}
      onOptionsChange={onOptionsChange}
      onSettings={() => setPhase('idle')}>
      <Pressable
        style={s.touchable}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Random number ${number}`}
        accessibilityHint="Starts and stops the generator">
        <Animated.Text
          style={[s.text, {transform: [{scale: pop}]}]}
          accessibilityLiveRegion="polite">
          {number}
        </Animated.Text>
      </Pressable>
    </SectionTemplate>
  )
}

const makeStyles = ({contentHeight, contentWidth}: Metrics, from: number, to: number) => {
  const decimals = Math.max(`${to}`.length, `${from}`.length)
  const maxWidth = (contentWidth * 2 * 0.8) / decimals
  const maxHeight = contentHeight * 0.7
  const fontSize = Math.min(maxWidth, maxHeight, 320)
  return StyleSheet.create({
    touchable: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: ON_COLOR,
      fontSize,
      fontWeight: fonts.bold,
      fontVariant: ['tabular-nums'],
    },
  })
}
