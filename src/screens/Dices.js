import React, { Component } from 'react'
import { Animated, Text, View, TouchableOpacity, Image } from 'react-native'
import { randomNumber } from '../utils/random'
import { SectionTemplate } from '../components/SectionTemplate'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'
import { resource } from '../utils/image'
import { storage } from '../services/storage'

// TODO: implement multi sided dices
export class Dices extends Component {

  constructor(...args) {
    super(...args)
    const count = storage.getNumber('Dices.count')
    const sides = storage.getNumber('Dices.sides')
    this.options = {
      count: {
        type: 'number',
        label: 'Count',
        defaultValue: count,
        constraints: { min: 1, max: 12 },
      },
      sides: {
        type: 'number',
        label: 'Sides',
        defaultValue: sides,
        constraints: { min: 2, max: 9999 },
      },
    }
    this.state = {
      count, sides,
      results0: this.generate(count, sides),
      results1: this.generate(count, sides),
    }
    this.onOptionsChange = this.onOptionsChange.bind(this)
    this.throwDices = this.throwDices.bind(this)
    this.thrownNumber = 0
    this.rotations = new Array(this.options.count.constraints.max)
      .fill(0)
      .map(() => new Animated.Value(0))
    this.visibleFace = 0
  }

  generate(count, sides) {
    return new Array(count)
      .fill(0)
      .map(() => randomNumber(1, sides))
  }

  throwDices() {
    this.visibleFace = (this.visibleFace + 1) % 2
    this.setState({
      [`results${this.visibleFace}`]: this.generate(this.state.count, this.state.sides),
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

  onOptionsChange({ count, sides }) {
    storage.set('Dices.count', count.value)
    storage.set('Dices.sides', sides.value)
    this.setState({
      count: count.value,
      sides: sides.value,
      results0: this.generate(count.value, sides.value),
      results1: this.generate(count.value, sides.value),
    })
  }

  render() {
    // since backface visibility is not implemented on android I need to use scaling
    const { results0, results1, count, sides } = this.state
    const s = makeStyles({ count, sides })
    // TODO: 0 as value for scale does not work properly:
    // https://github.com/facebook/react-native/issues/10510
    const min = 0.0001
    const textMode = sides > 6
    return (
      <SectionTemplate
        {...this.props}
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
                opacity: this.rotations[i].interpolate({
                  inputRange: [0, 1, 2, 3, 4],
                  outputRange: [1, 1, 0, 1, 1],
                }),
              }}>
              <DiceGraphic result={r} s={s} textMode={textMode} />
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
                  opacity: this.rotations[i].interpolate({
                    inputRange: [0, 1, 2, 3, 4],
                    outputRange: [0, 1, 1, 1, 0],
                  }),
                }}>
                  <DiceGraphic result={r} s={s} textMode={textMode} />
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

const DiceGraphic = ({ result, s, textMode }) => {
  if (textMode || result > 6) {
    return (
      <View style={[s.diceImage, s.diceTextContainer]}>
        <Text style={s.diceText}>{result}</Text>
      </View>
    )
  }
  return (
    <Image style={s.diceImage} source={sources[result]} />
  )
}

const makeStyles = ResponsiveStyleSheet.create(({
  count,
  sides,
  contentWidth,
  contentHeight,
  settingsHeight,
  controlsHeight,
  contentPadding,
}) => {
  const area = contentWidth * (contentHeight - settingsHeight - controlsHeight)
  const evenCount = count + count % 2
  const diceArea = Math.sqrt(area / evenCount + 1)
  const sizeRatio = 0.7
  const size = Math.min(diceArea * sizeRatio, 120)
  const margin = diceArea * (1 - sizeRatio) / 6
  const textFontSize = sides < 100 ? 60 : 40
  return {
    ounterContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: settingsHeight,
      marginBottom: controlsHeight - contentPadding,
      position: 'relative',
    },
    container: {
      flexWrap: 'wrap',
      width: contentWidth,
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
      borderRadius: size / 10,
    },
    diceText: {
      fontSize: textFontSize,
      color: 'black',
    },
  }
})
