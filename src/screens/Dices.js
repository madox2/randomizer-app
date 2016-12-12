import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { randomNumber } from '../utils/random'
import { SectionTemplate } from '../components/SectionTemplate'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'
import { resource } from '../utils/image'
import { storage } from '../services/storage'

// TODO: implement multi sided dices
const makeOptions = count => ({
  count: {
    type: 'number',
    label: 'Count',
    defaultValue: count || 4,
    constraints: { min: 1, max: 12 },
  },
})

export class Dices extends Component {

  constructor(...args) {
    super(...args)
    this.options = makeOptions(storage.get('Dices.count'))
    const count = this.options.count.defaultValue
    this.state = { count, results: this.generate(count) }
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
    if (this.interval) {
      return
    }
    this.setState({
      results: this.generate(this.state.count),
    })
  }

  onOptionsChange({ count }) {
    storage.set('Dices.count', count.value)
    this.setState({
      count: count.value,
      results: this.generate(count.value),
    })
  }

  render() {
    const { results, count } = this.state
    const s = makeStyles({ count })
    return (
      <SectionTemplate
        color={this.props.color}
        buttonColor={this.props.buttonColor}
        options={this.options}
        onOptionsChange={this.onOptionsChange}
        title='Dices'
      >
        <TouchableOpacity
          onPress={this.throwDices}
          activeOpacity={0.6}
          style={s.ounterContainer}
        >
          <View style={s.container}>
            {results.map((r, i) => (
              <DiceGraphic result={r} key={`${r}-${i}`} s={s} />
            ))}
          </View>
        </TouchableOpacity>
      </SectionTemplate>
    )
  }

}

const sources = {
  1: resource('images/dice1.png'),
  2: resource('images/dice2.png'),
  3: resource('images/dice3.png'),
  4: resource('images/dice4.png'),
  5: resource('images/dice5.png'),
  6: resource('images/dice6.png'),
}

const DiceGraphic = ({ result, s }) => {
  if (result > 6 || result < 0) {
    // not implemented yet
    return (
      <View style={[s.diceImage, s.diceTextContainer]}>
        <Text>{result}</Text>
      </View>
    )
  }
  return (
    <Image style={s.diceImage} source={sources[result]} />
  )
}

const makeStyles = ResponsiveStyleSheet.create(({ count, contentWidth, contentHeight, settingsHeight, controlsHeight, contentPadding }) => {
  const area = contentWidth * (contentHeight - settingsHeight - controlsHeight)
  const evenCount = count + count % 2
  const diceArea = Math.sqrt(area / evenCount + 1)
  const sizeRatio = 0.7
  const size = Math.min(diceArea * sizeRatio, 120)
  const margin = diceArea * (1 - sizeRatio) / 6
  return {
    ounterContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: settingsHeight + contentPadding,
      marginBottom: controlsHeight,
    },
    container: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    diceImage: {
      margin: margin,
      width: size,
      height: size,
    },
    diceTextContainer: {
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
})
