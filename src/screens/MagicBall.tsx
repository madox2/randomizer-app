import React, {useRef, useState} from 'react'
import {Animated, Easing, Pressable, StyleSheet, Text, View} from 'react-native'
import {BallBody, BallTriangle} from '../components/art/game'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {fonts, ON_COLOR} from '../theme/colors'
import {Metrics, useMetrics} from '../theme/metrics'
import {USE_NATIVE_DRIVER} from '../utils/gesture'
import {haptics} from '../utils/haptics'
import {randomNumber} from '../utils/random'

type AnswerType = 'positive' | 'neutral' | 'negative'

const answers: {text: string; type: AnswerType}[] = [
  {text: 'It is certain', type: 'positive'},
  {text: 'It is decidedly so', type: 'positive'},
  {text: 'Without a doubt', type: 'positive'},
  {text: 'Yes, definitely', type: 'positive'},
  {text: 'You may rely on it', type: 'positive'},
  {text: 'As I see it, yes', type: 'positive'},
  {text: 'Most likely', type: 'positive'},
  {text: 'Outlook good', type: 'positive'},
  {text: 'Yes', type: 'positive'},
  {text: 'Signs point to yes', type: 'positive'},
  {text: 'Reply hazy try again', type: 'neutral'},
  {text: 'Ask again later', type: 'neutral'},
  {text: 'Better not tell you now', type: 'neutral'},
  {text: 'Cannot predict now', type: 'neutral'},
  {text: 'Concentrate and ask again', type: 'neutral'},
  {text: "Don't count on it", type: 'negative'},
  {text: 'My reply is no', type: 'negative'},
  {text: 'My sources say no', type: 'negative'},
  {text: 'Outlook not so good', type: 'negative'},
  {text: 'Very doubtful', type: 'negative'},
]

const triangleColors: Record<AnswerType, string> = {
  positive: '#2c9a63',
  neutral: '#3b46c4',
  negative: '#c9453d',
}

const randomAnswer = () => randomNumber(0, answers.length - 1)

const SHAKE = [-10, 10, -8, 8, -4, 4, 0]

export const MagicBall = (props: SectionProps) => {
  // nothing is answered until the first question
  const [selected, setSelected] = useState<number | null>(null)
  // the answer layer stays mounted: an animated value which loses all its
  // consumers stops its running animation
  const fade = useRef(new Animated.Value(0)).current
  const shake = useRef(new Animated.Value(0)).current
  const busy = useRef(false)
  const m = useMetrics()
  const s = makeStyles(m)

  const ask = () => {
    if (busy.current) {
      return
    }
    busy.current = true
    haptics.tap()
    Animated.timing(fade, {toValue: 0, duration: 120, useNativeDriver: USE_NATIVE_DRIVER}).start()
    Animated.sequence(
      SHAKE.map((toValue) =>
        Animated.timing(shake, {toValue, duration: 55, useNativeDriver: USE_NATIVE_DRIVER}),
      ),
    ).start(() => {
      setSelected(randomAnswer())
      haptics.thud()
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(() => {
        busy.current = false
      })
    })
  }

  const answer = selected === null ? null : answers[selected]

  return (
    <SectionTemplate {...props}>
      <Pressable
        onPress={ask}
        style={s.container}
        accessibilityRole="button"
        accessibilityLabel={answer ? `Magic 8-ball: ${answer.text}` : 'Magic 8-ball'}
        accessibilityHint="Ask a question">
        <Animated.View style={{transform: [{translateX: shake}]}}>
          <BallBody size={s.size} />
          <View style={s.window}>
            {answer === null && <Text style={s.eight}>8</Text>}
            <Animated.View style={[s.answer, {opacity: fade}]}>
              {answer && (
                <>
                  <View style={s.triangle}>
                    <BallTriangle
                      width={s.triangleWidth}
                      height={s.triangleHeight}
                      color={triangleColors[answer.type]}
                    />
                  </View>
                  <View style={s.textBox}>
                    <Text style={s.text}>{answer.text}</Text>
                  </View>
                </>
              )}
            </Animated.View>
          </View>
        </Animated.View>
      </Pressable>
    </SectionTemplate>
  )
}

const makeStyles = ({contentWidth, contentHeight}: Metrics) => {
  const size = Math.min(contentWidth, contentHeight, 420)
  const d = size * 0.52
  const triangleWidth = d * 0.76
  const triangleHeight = triangleWidth * 0.87
  const frameWidth = Math.max(3, size * 0.012)
  return {
    size,
    triangleWidth,
    triangleHeight,
    ...StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      window: {
        position: 'absolute',
        top: (size - d) / 2,
        left: (size - d) / 2,
        width: d,
        height: d,
        borderRadius: d / 2,
        borderWidth: frameWidth,
        borderColor: '#f4f4f6',
        backgroundColor: '#0c0c12',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      },
      eight: {
        color: ON_COLOR,
        fontSize: d * 0.6,
        fontWeight: fonts.bold,
      },
      answer: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        justifyContent: 'center',
      },
      triangle: {
        position: 'absolute',
        top: (d - triangleHeight) / 2 - frameWidth / 2,
      },
      textBox: {
        position: 'absolute',
        top: (d - triangleHeight) / 2 + triangleHeight * 0.38,
        width: triangleWidth * 0.62,
        height: triangleHeight * 0.55,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        color: ON_COLOR,
        textAlign: 'center',
        fontSize: size * 0.036,
        fontWeight: fonts.semibold,
      },
    }),
  }
}
