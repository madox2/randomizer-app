import React, { Component } from 'react'
import { Text } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { randomNumber } from '../utils/random'

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

export class MagicBall extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      selected: null,
    }
    this.onFire = this.onFire.bind(this)
    this.onReset = this.onReset.bind(this)
  }

  onFire() {
    const selected = randomNumber(0, answers.length - 1)
    this.setState({ selected })
  }

  onReset() {
    this.setState({ selected: null })
  }

  render() {
    const { selected } = this.state
    return (
      <SectionTemplate
        onFire={this.onFire}
        onReset={this.onReset}
        title='Magic 8-Ball'
      >
        <Text>
        {selected === null
          ? null
          : answers[selected].text
        }
        </Text>
      </SectionTemplate>
    )
  }

}
