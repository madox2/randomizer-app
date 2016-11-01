import React, { Component } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { randomNumber } from '../utils/random'
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
    this.state = {
      from: options.from.defaultValue,
      to: options.to.defaultValue,
      number: 0,
    }
    this.onFire = this.onFire.bind(this)
    this.onReset = this.onReset.bind(this)
    this.onOptionsChange = this.onOptionsChange.bind(this)
  }

  onFire() {
    const { from, to } = this.state
    const number = randomNumber(from, to)
    this.setState({ number })
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
          onPress={this.onFire}
          activeOpacity={0.6}
        >
          <Text style={s.text}>{this.state.number}</Text>
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

