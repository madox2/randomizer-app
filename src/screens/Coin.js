import React, { Component } from 'react'
import { Text } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { randomBoolean } from '../utils/random'

export class Coin extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      side: false,
    }
    this.onFire = this.onFire.bind(this)
    this.onReset = this.onReset.bind(this)
  }

  onFire() {
    const side = randomBoolean()
    this.setState({ side })
  }

  onReset() {
    this.setState({ side: false })
  }

  render() {
    return (
      <SectionTemplate
        onFire={this.onFire}
        onReset={this.onReset}
        title='Coin'
      >
        <Text>{'' + this.state.side}</Text>
      </SectionTemplate>
    )
  }

}

