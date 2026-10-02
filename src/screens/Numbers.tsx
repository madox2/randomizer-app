import React, {useCallback, useEffect, useRef, useState} from 'react'
import {StyleSheet, Text, TouchableOpacity} from 'react-native'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {Options} from '../components/UserOptions'
import {storage} from '../services/storage'
import {Metrics, useMetrics} from '../theme/metrics'
import {randomColor, randomNumber} from '../utils/random'

const validator = (options: Options) =>
  Number(options.from.value) > Number(options.to.value)
    ? 'From have to be less than to'
    : null

export const Numbers = (props: SectionProps) => {
  const [range, setRange] = useState(() => ({
    from: storage.getNumber('Numbers.from'),
    to: storage.getNumber('Numbers.to'),
  }))
  const {from, to} = range
  const [number, setNumber] = useState(() => randomNumber(from, to))
  const [color, setColor] = useState(randomColor)
  const [isGenerating, setGenerating] = useState(false)
  const s = makeStyles(useMetrics(), from, to)

  const [options] = useState<Options>(() => ({
    from: {type: 'number', label: 'From', defaultValue: from},
    to: {type: 'number', label: 'To', defaultValue: to, validator},
  }))

  useEffect(() => {
    if (!isGenerating) {
      return
    }
    const interval = setInterval(() => {
      setNumber(randomNumber(from, to))
      setColor(randomColor())
    }, 100)
    return () => clearInterval(interval)
  }, [isGenerating, from, to])

  const stop = useCallback(() => setGenerating(false), [])

  const onOptionsChange = ({from: f, to: t}: Options) => {
    const next = {from: Number(f.value), to: Number(t.value)}
    storage.set('Numbers.from', next.from)
    storage.set('Numbers.to', next.to)
    setNumber(randomNumber(next.from, next.to))
    setRange(next)
  }

  return (
    <SectionTemplate
      {...props}
      options={options}
      onOptionsChange={onOptionsChange}
      onSettings={stop}
      style={s.container}>
      <TouchableOpacity
        style={s.touchable}
        onPress={() => setGenerating((generating) => !generating)}
        activeOpacity={0.6}>
        <Text style={[s.text, {color}]}>{number}</Text>
      </TouchableOpacity>
    </SectionTemplate>
  )
}

const makeStyles = (
  {contentHeight, contentWidth, controlsHeight, settingsHeight}: Metrics,
  from: number,
  to: number,
) => {
  const decimals = Math.max(`${to}`.length, `${from}`.length)
  const availableHeight = contentHeight - settingsHeight - controlsHeight / 2
  const maxWidth = (contentWidth * 2 * 0.8) / decimals
  const maxHeight = availableHeight * 0.6
  const fontSize = Math.min(maxWidth, maxHeight, 350)
  return StyleSheet.create({
    container: {
      marginTop: settingsHeight,
      marginBottom: controlsHeight / 2,
    },
    touchable: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize,
    },
  })
}
