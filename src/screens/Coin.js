import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Animated, Easing, View } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { randomNumber } from '../utils/random'

export class Coin extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      animationIdx: 0,
      rotation: new Animated.Value(0),
    }
    this.throwCoin = this.throwCoin.bind(this)
  }

  throwCoin() {
    if (this.state.rotating) {
      return
    }
    const time = new Animated.Value(0)
    Animated.timing(time, {
      toValue: 15 + randomNumber(0, 1),
      duration: 1000,
      easing: Easing.linear,
    }).start(() => {
      // FIXME: this._parent.removeListener is not a function
      // it fails to set state for the first time and animated value
      // must be set to prevent from next fails. is it web related only?
      // quickfix: set animated value and catch error for the first setState
      // quickfix is needed for each animated element in view
      try { this.setState({ rotation: new Animated.Value(0) }) } catch(e) { console.warn(e) }
      try { this.setState({ rotation: new Animated.Value(0) }) } catch(e) { console.warn(e) }
      this.setState({
        rotation: new Animated.Value(0),
        rotating: false,
      })
    })
    this.setState({
      rotation: Animated.modulo(time, 2),
      rotating: true,
    })
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
              source={{ uri: '../resources/images/coin0.svg' }}
              style={[s.image, {
                transform: [
                  {rotateX: this.state.rotation.interpolate({
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
                  {rotateX: this.state.rotation.interpolate({
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
