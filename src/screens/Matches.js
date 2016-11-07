import React, { Component } from 'react'
import { Text } from 'react-native'
import { randomNumber } from '../utils/random'
import { SectionTemplate } from '../components/SectionTemplate'

const options = {
  count: {
    type: 'number',
    label: 'Count',
    defaultValue: 3,
    constraints: { min: 1, max: 10 },
  },
}

export class Matches extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      count: options.count.defaultValue,
      selected: 0,
    }
    this.onRefresh = this.onRefresh.bind(this)
    this.onOptionsChange = this.onOptionsChange.bind(this)
  }

  onRefresh() {
    const selected = randomNumber(1, this.state.count)
    this.setState({ selected })
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
        title='Matches'
        color={this.props.color}
      >
        <Text>{this.state.selected}</Text>
      </SectionTemplate>
    )
  }

}

