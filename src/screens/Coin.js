import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Animated, Easing, Image } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { randomBoolean } from '../utils/random'

export class Coin extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      side: randomBoolean(),
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
      toValue: 20,
      duration: 1000,
      easing: Easing.linear,
    }).start(() => {
      // FIXME: this._parent.removeListener is not a function
      // it fails to set state for the first time and animated value
      // must be set to prevent from next fails. is it web related only?
      // quickfix: set animated value and catch error for the first setState
      try {
        this.setState({
          rotation: new Animated.Value(0),
        })
      } catch(e) {
        console.warn(e)
      }
      this.setState({
        rotation: new Animated.Value(0),
        rotating: false,
        side: randomBoolean(),
      })
    })
    this.setState({
      rotation: Animated.modulo(time, 2),
      rotating: true,
    })
  }

  makeUri() {
    const idx = this.state.side ? 0 : 1
    return `../resources/images/coin${idx}.svg`
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
          {!this.state.rotating &&
            <Image
              source={{ uri: this.makeUri()}}
              style={s.image}
            />
          }
          {this.state.rotating &&
            <Animated.Image
              source={{ uri: '../resources/images/coin2.svg' }}
              style={[s.image, {
                transform: [
                  {scaleY: this.state.rotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  })},
                ],
              }]}
            />
          }
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
  },
})
