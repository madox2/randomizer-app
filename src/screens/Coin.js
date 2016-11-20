import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Animated, Easing, View } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { randomNumber } from '../utils/random'

export class Coin extends Component {

  constructor(...args) {
    super(...args)
    this.throwCoin = this.throwCoin.bind(this)
    this.time = new Animated.Value(0)
    this.rotation = Animated.modulo(this.time, 2)
  }

  throwCoin() {
    this.time.setValue(0)
    Animated.timing(this.time, {
      toValue: 15 + randomNumber(0, 1),
      duration: 1000,
      easing: Easing.linear,
    }).start()
  }

  render() {
    return (
      <SectionTemplate
        title='Coin'
        color={this.props.color}
      >
        <TouchableOpacity
          onPress={this.throwCoin}
          activeOpacity={0.6}
          style={s.touchable}
        >
          <View style={{position:'relative'}}>
            <Animated.Image
              ref={r => this.image1 = r}
              source={{ uri: '../resources/images/coin0.svg' }}
              style={[s.image, {
                transform: [
                  {rotateX: this.rotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  })},
                ],
                position: 'absolute',
                top: 0,
                left: 0,
              }]}
            />
            <Animated.Image
              source={{ uri: '../resources/images/coin1.svg' }}
              style={[s.image, {
                transform: [
                  {rotateX: this.rotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['180deg', '0deg'],
                  })},
                ],
              }]}
            />
          </View>
        </TouchableOpacity>
      </SectionTemplate>
    )
  }

}

const s = StyleSheet.create({
  touchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 230,
    height: 230,
    backfaceVisibility: 'hidden',
  },
})
