import React, { Component } from 'react'
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native'
import { SectionTemplate } from '../components/SectionTemplate'
import { randomBoolean } from '../utils/random'

export class Coin extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      side: randomBoolean(),
      animationIdx: 0,
      anim: new Animated.Value(0),
    }
    this.throwCoin = this.throwCoin.bind(this)
  }

  throwCoin() {
    this.setState({
      anim: new Animated.Value(0),
      side: randomBoolean(),
    }, () => {
      Animated.timing(
        this.state.anim,
        {toValue: this.size}
      ).start()
    })
  }

  componentWillMount() {
    this.size = 20
    this.inputRange = new Array(this.size).fill(0).map((a, i) => i)
    this.outputRange = new Array(this.size).fill(0).map((a, i) => (i + 1) % 2)
  }

  componentDidMount() {
  }

  render() {
    return (
      <SectionTemplate
        title='Coin'
        color={this.props.color}
      >
        <TouchableOpacity
          style={s.touchable}
          onPress={this.throwCoin}
          activeOpacity={0.6}
        >
          <View style={{ width: 230, height: 230 }}>
              <Animated.Image
                source={{ uri: '../resources/images/coin.svg' }}
                style={{
                  height: 230,
                  width: 230,
                  transform: [
                    {scaleX: this.state.anim.interpolate({
                      inputRange: this.inputRange,
                      outputRange: this.outputRange,
                    })},
                    {rotate: this.state.side ? '0deg' : '180deg'},
                  ],
                }}
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
})
