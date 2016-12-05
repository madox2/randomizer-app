import React, { Component } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { randomNumber, randomColor } from '../utils/random'
import { SectionTemplate } from '../components/SectionTemplate'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

const options = {
  from: {
    type: 'number',
    label: 'From',
    defaultValue: 0,
  },
  to: {
    type: 'number',
    label: 'To',
    defaultValue: 100,
  },
}

export class Numbers extends Component {

  constructor(...args) {
    super(...args)
    const from = options.from.defaultValue
    const to = options.to.defaultValue
    const number = randomNumber(from, to)
    const color = randomColor()
    this.state = {
      from, to, number, color,
      isGenerating: false,
    }
    this.toggleGenerating = this.toggleGenerating.bind(this)
    this.onOptionsChange = this.onOptionsChange.bind(this)
    this.generate = this.generate.bind(this)
  }

  toggleGenerating() {
    if (this.state.isGenerating) {
      clearInterval(this.generation)
      this.setState({ isGenerating: false })
      return
    }
    this.generation = setInterval(this.generate, 75)
    this.setState({ isGenerating: true })
  }

  generate() {
    const { from, to } = this.state
    const number = randomNumber(from, to)
    const color = randomColor()
    this.setState({ number, color })
  }

  onOptionsChange({ from, to }) {
    this.setState({
      from: from.value,
      to: to.value,
    })
  }

  componentWillUnmount() {
    this.generation && clearInterval(this.generation)
  }

  render() {
    const { color, number, from, to } = this.state
    const s = makeStyles({ from, to })
    return (
      <SectionTemplate
        options={options}
        onOptionsChange={this.onOptionsChange}
        title='Numbers'
        style={s.container}
        color={this.props.color}
      >
        <TouchableOpacity
          style={s.touchable}
          onPress={this.toggleGenerating}
          activeOpacity={0.6}
        >
          <Text style={[s.text, { color }]}>{number}</Text>
        </TouchableOpacity>
      </SectionTemplate>
    )
  }

}

const makeStyles = ResponsiveStyleSheet.create(({ contentHeight, contentWidth, from, to }) => {
  const decimals = Math.max(`${to}`.length, `${from}`.length)
  const maxWidth = contentWidth * 2 * 0.8 / decimals
  const maxHeight = contentHeight * 0.5
  const fontSize = Math.min(maxWidth, maxHeight)
  return {
    container: {
    },
    touchable: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: fontSize,
    },
  }
})
