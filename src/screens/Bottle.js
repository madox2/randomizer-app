import React, { Component } from 'react'
import { Text } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { randomNumber } from '../utils/random'

export class Bottle extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      angle: 0,
    }
    this.onFire = this.onFire.bind(this)
    this.onReset = this.onReset.bind(this)
  }

  onFire() {
    const angle = randomNumber(0, 360)
    this.setState({ angle })
  }

  onReset() {
    this.setState({ angle: 0 })
  }

  render() {
    return (
      <SectionTemplate
        onFire={this.onFire}
        onReset={this.onReset}
        title='Bottle'
      >
        <Text>{this.state.angle}</Text>
      </SectionTemplate>
    )
  }

}

