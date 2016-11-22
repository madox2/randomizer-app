import React, { Component } from 'react'
import { Text, Image, View } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { randomNumber } from '../utils/random'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

const answers = [
  { text: 'It is certain', type: 'positive' },
  { text: 'It is decidedly so', type: 'positive' },
  { text: 'Without a doubt', type: 'positive' },
  { text: 'Yes, definitely', type: 'positive' },
  { text: 'You may rely on it', type: 'positive' },
  { text: 'As I see it, yes', type: 'positive' },
  { text: 'Most likely', type: 'positive' },
  { text: 'Outlook good', type: 'positive' },
  { text: 'Yes', type: 'positive' },
  { text: 'Signs point to yes', type: 'positive' },
  { text: 'Reply hazy try again', type: 'neutral' },
  { text: 'Ask again later', type: 'neutral' },
  { text: 'Better not tell you now', type: 'neutral' },
  { text: 'Cannot predict now', type: 'neutral' },
  { text: 'Concentrate and ask again', type: 'neutral' },
  { text: 'Don\'t count on it', type: 'negative' },
  { text: 'My reply is no', type: 'negative' },
  { text: 'My sources say no', type: 'negative' },
  { text: 'Outlook not so good', type: 'negative' },
  { text: 'Very doubtful', type: 'negative' },
]

const ballSource = { uri: '../resources/images/ball.svg' }
const ballTriangleSource = { uri: '../resources/images/ball-triangle.svg' }

export class MagicBall extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      selected: randomNumber(0, answers.length - 1),
    }
    this.onRefresh = this.onRefresh.bind(this)
  }

  onRefresh() {
    const selected = randomNumber(0, answers.length - 1)
    this.setState({ selected })
  }

  render() {
    // TODO: animation
    const { selected } = this.state
    const s = makeStyles()
    return (
      <SectionTemplate
        onRefresh={this.onRefresh}
        title='Magic 8-Ball'
        color={this.props.color}
      >
        <View style={s.container}>
          <View>
            <Image source={ballSource} style={s.image} />
            <View style={s.holeFrame} />
            <View style={s.hole}>
              <Image source={ballTriangleSource} style={s.triangle} />
              <Text style={s.text}>{answers[selected].text}</Text>
            </View>
          </View>
        </View>
      </SectionTemplate>
    )
  }

}

const makeStyles = ResponsiveStyleSheet.create(({ width }) => {
  // TODO: responsiveness
  const size = width - 50
  const y = 0.275 * size
  const x = 0.196 * size
  const r = 0.25 * size
  const d = r * 2
  const triangleA = r * Math.sqrt(3)
  const frameWidth = 2
  return {
    image: {
      height: size,
      width: size,
    },
    text: {
      position: 'absolute',
      color: 'white',
      top: r / 2,
      paddingTop: 10,
      width: r,
      textAlign: 'center',
    },
    hole: {
      position: 'absolute',
      top: y,
      left: x,
      width: d,
      height: d,
      borderRadius: r,
      flex: 1,
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
  }
})

