import React, {useLayoutEffect, useRef, useState} from 'react'
import {Animated, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {Options} from '../components/UserOptions'
import {images} from '../resources/images'
import {storage} from '../services/storage'
import {Metrics, useMetrics} from '../theme/metrics'
import {USE_NATIVE_DRIVER} from '../utils/gesture'
import {randomNumber} from '../utils/random'

const MAX_COUNT = 12

// scale of the flipped dice (0 does not work properly on android)
const MIN_SCALE = 0.0001

const generate = (count: number, sides: number) =>
  Array.from({length: count}, () => randomNumber(1, sides))

const faces: Record<number, number> = {
  1: images.dice1,
  2: images.dice2,
  3: images.dice3,
  4: images.dice4,
  5: images.dice5,
  6: images.dice6,
}

type Styles = ReturnType<typeof makeStyles>

const DiceGraphic = ({result, s, textMode}: {result: number; s: Styles; textMode: boolean}) => {
  if (textMode || result > 6) {
    return (
      <View style={[s.diceImage, s.diceTextContainer]}>
        <Text style={s.diceText}>{result}</Text>
      </View>
    )
  }
  return <Image style={s.diceImage} source={faces[result]} />
}

export const Dices = (props: SectionProps) => {
  const [settings, setSettings] = useState(() => ({
    count: storage.getNumber('Dices.count'),
    sides: storage.getNumber('Dices.sides'),
  }))
  const {count, sides} = settings
  // The results are displayed on two faces. A throw prepares the results on
  // the hidden face and flips the dices to show it.
  const [results, setResults] = useState(() => [
    generate(count, sides),
    generate(count, sides),
  ])
  const [throwNumber, setThrowNumber] = useState(0)
  const visibleFace = useRef(0)
  const rotations = useRef(
    Array.from({length: MAX_COUNT}, () => new Animated.Value(0)),
  ).current
  const s = makeStyles(useMetrics(), count, sides)

  const [options] = useState<Options>(() => ({
    count: {
      type: 'number',
      label: 'Count',
      defaultValue: count,
      constraints: {min: 1, max: MAX_COUNT},
    },
    sides: {
      type: 'number',
      label: 'Sides',
      defaultValue: sides,
      constraints: {min: 2, max: 9999},
    },
  }))

  useLayoutEffect(() => {
    if (throwNumber === 0) {
      return
    }
    const base = visibleFace.current ? 0 : 2
    const animations = rotations.slice(0, count).map((rotation) => {
      rotation.setValue(base)
      return Animated.timing(rotation, {
        toValue: base + 2,
        duration: 300,
        delay: randomNumber(0, 300),
        useNativeDriver: USE_NATIVE_DRIVER,
      })
    })
    rotations.slice(count).forEach((rotation) => rotation.setValue(base))
    const animation = Animated.parallel(animations)
    animation.start()
    return () => animation.stop()
  }, [throwNumber, rotations, count])

  const throwDices = () => {
    visibleFace.current = (visibleFace.current + 1) % 2
    setResults((current) =>
      current.map((r, face) =>
        face === visibleFace.current ? generate(count, sides) : r,
      ),
    )
    setThrowNumber((n) => n + 1)
  }

  const onOptionsChange = ({count: c, sides: sd}: Options) => {
    const next = {count: Number(c.value), sides: Number(sd.value)}
    storage.set('Dices.count', next.count)
    storage.set('Dices.sides', next.sides)
    setSettings(next)
    setResults([
      generate(next.count, next.sides),
      generate(next.count, next.sides),
    ])
  }

  const textMode = sides > 6
  // faces are flipped by scaling since backface visibility is not
  // supported on android
  const face = (i: number, front: boolean) => ({
    transform: [
      {
        scaleY: rotations[i].interpolate({
          inputRange: [0, 1, 2, 3, 4],
          outputRange: front
            ? [1, MIN_SCALE, MIN_SCALE, MIN_SCALE, 1]
            : [MIN_SCALE, MIN_SCALE, 1, MIN_SCALE, MIN_SCALE],
        }),
      },
    ],
    opacity: rotations[i].interpolate({
      inputRange: [0, 1, 2, 3, 4],
      outputRange: front ? [1, 1, 0, 1, 1] : [0, 1, 1, 1, 0],
    }),
  })

  return (
    <SectionTemplate
      {...props}
      options={options}
      onOptionsChange={onOptionsChange}>
      <TouchableOpacity
        onPress={throwDices}
        activeOpacity={0.6}
        style={s.counterContainer}>
        <View style={s.container}>
          {results[0].map((r, i) => (
            <Animated.View key={`s${r}-${i}`} style={face(i, true)}>
              <DiceGraphic result={r} s={s} textMode={textMode} />
            </Animated.View>
          ))}
          <View style={[s.container, s.hiddenContainer]}>
            {results[1].map((r, i) => (
              <Animated.View key={`h${r}-${i}`} style={face(i, false)}>
                <DiceGraphic result={r} s={s} textMode={textMode} />
              </Animated.View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </SectionTemplate>
  )
}

const makeStyles = (
  {
    contentWidth,
    contentHeight,
    settingsHeight,
    controlsHeight,
    contentPadding,
  }: Metrics,
  count: number,
  sides: number,
) => {
  const area = contentWidth * (contentHeight - settingsHeight - controlsHeight)
  const evenCount = count + (count % 2)
  const diceArea = Math.sqrt(area / evenCount + 1)
  const sizeRatio = 0.7
  const size = Math.min(diceArea * sizeRatio, 120)
  const margin = (diceArea * (1 - sizeRatio)) / 6
  const textFontSize = sides < 100 ? size / 2 : size / 3
  return StyleSheet.create({
    counterContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: settingsHeight,
      marginBottom: controlsHeight - contentPadding,
      position: 'relative',
    },
    container: {
      flexWrap: 'wrap',
      width: contentWidth,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    hiddenContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    diceImage: {
      margin,
      width: size,
      height: size,
    },
    diceTextContainer: {
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: size / 10,
    },
    diceText: {
      fontSize: textFontSize,
      color: 'black',
    },
  })
}
