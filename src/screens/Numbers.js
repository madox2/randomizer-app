import React, { Component } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { randomNumber, randomColor } from '../utils/random'
import { SectionTemplate } from '../components/SectionTemplate'

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
    this.onFire = this.onFire.bind(this)
    this.onReset = this.onReset.bind(this)
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

  onFire() {
    this.generate()
  }

  onReset() {
    this.setState({ number: 0 })
  }

  onOptionsChange({ from, to }) {
    this.setState({
      from: from.value,
      to: to.value,
    })
  }

  render() {
    const { color, number } = this.state
    return (
      <SectionTemplate
        onFire={this.onFire}
        onReset={this.onReset}
        options={options}
        onOptionsChange={this.onOptionsChange}
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

const s = StyleSheet.create({
  container: {
  },
  touchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 150, // TODO: responsive font size?
  },
})

