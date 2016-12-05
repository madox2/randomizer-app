import React, { Component } from 'react'
import { TouchableOpacity, View, Image } from 'react-native'
import { randomNumber } from '../utils/random'
import { SectionTemplate } from '../components/SectionTemplate'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

const options = {
  count: {
    type: 'number',
    label: 'Count',
    defaultValue: 3,
    constraints: { min: 1, max: 10 },
  },
}

const matchSource = { uri: '../resources/images/match.svg' }
const matchBurnedSource = { uri: '../resources/images/match-burned.svg' }

export class Matches extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      count: options.count.defaultValue,
      states: this.getNewStates(options.count.defaultValue),
      selected: randomNumber(0, options.count.defaultValue - 1),
      throwNumber: 0,
    }
    this.onRefresh = this.onRefresh.bind(this)
    this.onOptionsChange = this.onOptionsChange.bind(this)
  }

  getNewStates(count) {
    return new Array(count).fill(false)
  }

  onRefresh() {
    const { count } = this.state
    const selected = randomNumber(0, count - 1)
    this.setState({ selected, states: this.getNewStates(count) })
  }

  onOptionsChange({ count }) {
    const selected = randomNumber(0, count.value - 1)
    this.setState({
      count: count.value,
      states: this.getNewStates(count.value),
      selected,
    })
  }

  showMatch(idx) {
    this.setState({
      states: this.state.states.map((s, i) => i === idx ? true : s),
    })
  }

  render() {
    const s = makeStyles()
    const { throwNumber, states, selected } = this.state
    return (
      <SectionTemplate
        onRefresh={this.onRefresh}
        options={options}
        onOptionsChange={this.onOptionsChange}
        title='Matches'
        color={this.props.color}
      >
        <View style={s.container}>
          {states.map((a, i) => (
            <TouchableOpacity
              key={`${throwNumber}-${i}`}
              onPress={() => this.showMatch(i)}
            >
              <View
                style={s.imageContainer}
              >
                <Image
                  style={[s.imageMatch, a ? s.showed : {}]}
                  source={a && i === selected ? matchBurnedSource : matchSource}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </SectionTemplate>
    )
  }

}

const makeStyles = ResponsiveStyleSheet.create(({ contentHeight, contentWidth }) => {
  const pullLength = contentHeight * 0.15
  const matchPadding = contentWidth * 0.03
  const matchHeight = contentHeight - pullLength
  return ({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    imageContainer: {
      paddingLeft: matchPadding,
      paddingRight: matchPadding,
      height: matchHeight,
    },
    imageMatch: {
      position: 'relative',
      resizeMode: 'stretch',
      height: matchHeight,
      width: matchHeight / 10.1,
    },
    showed: {
      bottom: pullLength,
    },
  })
})
