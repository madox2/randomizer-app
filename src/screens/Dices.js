import React, { Component } from 'react'
import { Animated, Text, View, TouchableOpacity, Image } from 'react-native'
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
    this.state = {
      count,
      results0: this.generate(count),
      results1: this.generate(count),
    }
    this.onOptionsChange = this.onOptionsChange.bind(this)
    this.throwDices = this.throwDices.bind(this)
    this.thrownNumber = 0
    this.rotations = new Array(this.options.count.constraints.max)
      .fill(0)
      .map(() => new Animated.Value(0))
    this.visibleFace = 0
  }

  generate(count) {
    return new Array(count)
      .fill(0)
      .map(() => randomNumber(1, 6))
  }

  throwDices() {
    this.visibleFace = (this.visibleFace + 1) % 2
    this.setState({
      [`results${this.visibleFace}`]: this.generate(this.state.count),
    }, () => {
      const base = this.visibleFace ? 0 : 2
      this.rotations.forEach(r => r.setValue(base))
      const animations = this.rotations
        .filter((r, i) => i < this.state.count)
        .map(r => {
          r.setValue(base)
          return Animated.timing(r, {
            toValue: base + 2,
            duration: 300,
            delay: randomNumber(0, 300),
          })
        })
      Animated.parallel(animations).start()
    })
  }

  onOptionsChange({ count }) {
    storage.set('Dices.count', count.value)
    this.setState({
      count: count.value,
      results0: this.generate(count.value),
      results1: this.generate(count.value),
    })
  }

  render() {
    // since backface visibility is not implemented on android I need to use scaling
    const { results0, results1, count } = this.state
    const s = makeStyles({ count })
    // TODO: 0 as value for scale does not work properly:
    // https://github.com/facebook/react-native/issues/10510
    const min = 0.001
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
            {results0.map((r, i) => (
              <Animated.View key={`s${r}-${i}`} style={{
                transform: [{
                  scaleY: this.rotations[i].interpolate({
                    inputRange: [0, 1, 2, 3, 4],
                    outputRange: [1, min, min, min, 1],
                  }),
                }],
              }}>
                <DiceGraphic result={r} s={s} />
              </Animated.View>
            ))}
            <View style={[s.container, s.hiddenContainer]}>
              {results1.map((r, i) => (
                <Animated.View key={`h${r}-${i}`} style={{
                  transform: [{
                    scaleY: this.rotations[i].interpolate({
                      inputRange: [0, 1, 2, 3, 4],
                      outputRange: [min, min, 1, min, min],
                    }),
                  }],
                }}>
                  <DiceGraphic result={r} s={s} />
                </Animated.View>
              ))}
            </View>
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
      position: 'relative',
    },
    container: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    hiddenContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
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
