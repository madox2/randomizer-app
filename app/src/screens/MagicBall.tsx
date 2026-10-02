import React, {useRef, useState} from 'react'
import {Animated, Easing, Image, StyleSheet, TouchableOpacity, View} from 'react-native'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {images} from '../resources/images'
import {Metrics, useMetrics} from '../theme/metrics'
import {USE_NATIVE_DRIVER} from '../utils/gesture'
import {randomNumber} from '../utils/random'

const answers = [
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

const randomAnswer = () => randomNumber(0, answers.length - 1)

export const MagicBall = (props: SectionProps) => {
  const [selected, setSelected] = useState(randomAnswer)
  const fade = useRef(new Animated.Value(1)).current
  const s = makeStyles(useMetrics())

  const ask = () => {
    setSelected(randomAnswer())
    fade.setValue(0)
    Animated.timing(fade, {
      toValue: 1,
      duration: 2000,
      easing: Easing.bezier(0.95, 0.05, 0.795, 0.035),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start()
  }

  return (
    <SectionTemplate {...props}>
      <TouchableOpacity onPress={ask} activeOpacity={0.8} style={s.container}>
        <View>
          <Image source={images.ball} style={s.image} />
          <View style={s.holeFrame} />
          <View style={s.hole}>
            <Animated.Image
              source={images.ballTriangle}
              style={[s.triangle, {opacity: fade}]}
            />
            <Animated.Text style={[s.text, {opacity: fade}]}>
              {answers[selected].text}
            </Animated.Text>
          </View>
        </View>
      </TouchableOpacity>
    </SectionTemplate>
  )
}

const makeStyles = ({contentWidth, contentHeight}: Metrics) => {
  const size = Math.min(contentWidth, contentHeight, 500)
  const y = 0.275 * size
  const x = 0.196 * size
  const r = 0.25 * size
  const d = r * 2
  const triangleA = r * Math.sqrt(3)
  const triangleAHalf = triangleA / 2
  const triangleHeight = Math.sqrt(
    triangleA * triangleA - triangleAHalf * triangleAHalf,
  )
  const frameWidth = 2
  return StyleSheet.create({
    image: {
      height: size,
      width: size,
    },
    text: {
      position: 'absolute',
      color: 'white',
      top: r / 2,
      left: r / 2,
      paddingTop: size * 0.03,
      width: r,
      textAlign: 'center',
      fontSize: size * 0.045,
    },
    hole: {
      position: 'absolute',
      top: y,
      left: x,
      width: d,
      height: d,
      borderRadius: r,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black',
    },
    holeFrame: {
      position: 'absolute',
      top: y - frameWidth,
      left: x - frameWidth,
      width: d + frameWidth * 2,
      height: d + frameWidth * 2,
      borderRadius: (d + frameWidth * 2) / 2,
      backgroundColor: 'white',
    },
    triangle: {
      height: triangleHeight,
      width: triangleA,
      position: 'absolute',
      left: r - triangleA / 2,
      bottom: 0,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
}
