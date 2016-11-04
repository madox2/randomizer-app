import React, { Component } from 'react'
import { Text } from 'react-native'
import { randomNumber } from '../utils/random'
import { SectionTemplate } from '../components/SectionTemplate'

const options = {
  count: {
    type: 'number',
    label: 'Count',
    defaultValue: 1,
    constraints: { min: 1, max: 12 },
  },
}

export class Dices extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      count: options.count.defaultValue,
      results: [],
    }
    this.onOptionsChange = this.onOptionsChange.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
  }

  onRefresh() {
    const results = new Array(this.state.count)
      .fill(0)
      .map(() => randomNumber(1, 6))
    this.setState({ results })
  }

  onOptionsChange({ count }) {
    this.setState({
      count: count.value,
    })
  }

  render() {
    return (
      <SectionTemplate
        onRefresh={this.onRefresh}
        options={options}
        onOptionsChange={this.onOptionsChange}
        title='Dices'
      >
        <Text>{JSON.stringify(this.state.results)}</Text>
      </SectionTemplate>
    )
  }

}

