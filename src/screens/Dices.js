import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { randomNumber } from '../utils/random'
import { SectionTemplate } from '../components/SectionTemplate'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

// TODO: implement multi sided dices
const options = {
  count: {
    type: 'number',
    label: 'Count',
    defaultValue: 4,
    constraints: { min: 1, max: 12 },
  },
}

export class Dices extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      count: options.count.defaultValue,
      results: this.generate(options.count.defaultValue),
    }
    this.onOptionsChange = this.onOptionsChange.bind(this)
    this.throwDices = this.throwDices.bind(this)
    this.thrownNumber = 0
  }

  generate(count) {
    return new Array(count)
      .fill(0)
      .map(() => randomNumber(1, 6))
  }

  throwDices() {
    this.setState({
      results: this.generate(this.state.count),
      thrownNumber: this.state.throwNumber + 1,
    })
  }

  onOptionsChange({ count }) {
    this.setState({
      count: count.value,
    })
  }

  render() {
    const { throwNumber, results } = this.state
    const s = makeStyles()
    return (
      <SectionTemplate
        color={this.props.color}
        options={options}
        onOptionsChange={this.onOptionsChange}
        title='Dices'
      >
        <TouchableOpacity
          onPress={this.throwDices}
          activeOpacity={0.6}
          style={s.container}
        >
          {results.map((r, i) => (
            <DiceGraphic result={r} key={`${throwNumber}-${i}`} />
          ))}
        </TouchableOpacity>
      </SectionTemplate>
    )
  }

}

const diceSource = num => ({ uri: `../resources/images/dice${num}.svg` })

const DiceGraphic = ({ result }) => {
  // TODO: responsiveness
  const s = makeStyles()
  if (result > 6 || result < 0) {
    // not implemented yet
    return (
      <View style={[s.diceImage, s.diceTextContainer]}>
        <Text>{result}</Text>
      </View>
    )
  }
  return (
    <Image style={s.diceImage} source={diceSource(result)} />
  )
}

const makeStyles = ResponsiveStyleSheet.create(() => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  diceImage: {
    margin: 30,
    width: 100,
    height: 100,
  },
  diceTextContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
