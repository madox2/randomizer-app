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
    this.onRefresh = this.onRefresh.bind(this)
  }

  onRefresh() {
    const side = randomBoolean()
    this.setState({ side })
  }

  render() {
    return (
      <SectionTemplate
        onRefresh={this.onRefresh}
        title='Coin'
      >
        <Text>{'' + this.state.side}</Text>
      </SectionTemplate>
    )
  }

}

