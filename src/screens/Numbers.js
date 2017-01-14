import React, { Component } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { randomNumber, randomColor } from '../utils/random'
import { SectionTemplate } from '../components/SectionTemplate'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'
import { storage } from '../services/storage'

const validator = options => {
  if (options.from.value > options.to.value) {
    return 'From have to be less than to'
  }
  return null
}

export class Numbers extends Component {

  constructor(...args) {
    super(...args)
    const from = storage.getNumber('Numbers.from')
    const to = storage.getNumber('Numbers.to')
    this.options = {
      from: {
        type: 'number',
        label: 'From',
        defaultValue: from,
      },
      to: {
        type: 'number',
        label: 'To',
        defaultValue: to,
        validator,
      },
    }
    const number = randomNumber(from, to)
    const color = randomColor()
    this.state = {
      from, to, number, color,
      isGenerating: false,
    }
    this.toggleGenerating = this.toggleGenerating.bind(this)
    this.onOptionsChange = this.onOptionsChange.bind(this)
    this.generate = this.generate.bind(this)
    this.stop = this.stop.bind(this)
  }

  toggleGenerating() {
    if (this.state.isGenerating) {
      this.stop()
      return
    }
    this.generation = setInterval(this.generate, 100)
    this.setState({ isGenerating: true })
  }

  generate() {
    const { from, to } = this.state
    const number = randomNumber(from, to)
    const color = randomColor()
    this.setState({ number, color })
  }

  onOptionsChange({ from, to }) {
    storage.set('Numbers.from', from.value)
    storage.set('Numbers.to', to.value)
    const number = randomNumber(from.value, to.value)
    this.setState({
      from: from.value,
      to: to.value,
      number,
    })
  }

  stop() {
    clearInterval(this.generation)
    this.setState({ isGenerating: false })
  }

  componentWillUnmount() {
    this.generation && clearInterval(this.generation)
  }

  render() {
    const { color, number, from, to } = this.state
    const s = makeStyles({ from, to })
    return (
      <SectionTemplate
        {...this.props}
        options={this.options}
        onOptionsChange={this.onOptionsChange}
        onSettings={this.stop}
        title='Numbers'
        style={s.container}
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

const makeStyles = ResponsiveStyleSheet.create(({ contentHeight, contentWidth, from, to, controlsHeight, settingsHeight }) => {
  const decimals = Math.max(`${to}`.length, `${from}`.length)
  const availableHeight = contentHeight - settingsHeight - controlsHeight / 2
  const maxWidth = contentWidth * 2 * 0.8 / decimals
  const maxHeight = availableHeight * 0.6
  const fontSize = Math.min(maxWidth, maxHeight, 350)
  return {
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
      fontSize: fontSize,
    },
  }
})
