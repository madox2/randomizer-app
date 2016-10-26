import React, { Component } from 'react'
import { View } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { randomNumber } from '../utils/random'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

const BottleItem = ({ angle, size }) => (
  <View style={{
    backgroundColor: 'red',
    borderTopWidth: 20,
    borderTopColor: 'blue',
    width: 3,
    height: size,
    transform: [ { rotate: `${angle}deg` } ],
  }}></View>
)

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
    const s = makeStyles()
    return (
      <SectionTemplate
        onFire={this.onFire}
        onReset={this.onReset}
        title='Bottle'
      >
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
          <BottleItem angle={this.state.angle} size={s.bottleItem.size} />
        </View>
      </SectionTemplate>
    )
  }

}

const makeStyles = ResponsiveStyleSheet.create(({ width, height }) => ({
  bottleItem: {
    size: Math.min(width, height * 2 / 3),
  },
}))
