import React, { PropTypes } from 'react'
import { View, StyleSheet } from 'react-native'
import { SectionButton } from '../components/SectionButton'
import { Coin, Matches, Bottle, Numbers, Dices, MagicBall } from '.'

const sections = [
  { title: 'Numbers',      color: '#79C753', uri: '../resources/numbers.svg' },
  { title: 'Coin',         color: '#F7786B', uri: '../resources/coin.svg' },
  { title: 'Bottle',       color: '#B18F6A', uri: '../resources/bottle.svg' },
  { title: 'Magic 8-Ball', color: '#92B6D5', uri: '../resources/ball.svg' },
  { title: 'Matches',      color: '#FAE03C', uri: '../resources/matches.svg' },
  { title: 'Dices',        color: '#B565A7', uri: '../resources/dice.svg' },
]

export const Welcome = (props, { navigate }) => {

  const navig = Screen => () => navigate(() => <Screen />)

  return (
    <View style={s.container}>
      <View style={s.row}>
        <SectionButton { ...sections[0] } onPress={navig(Numbers)} />
        <SectionButton { ...sections[1] } onPress={navig(Coin)} />
      </View>
      <View style={s.row}>
        <SectionButton { ...sections[2] } onPress={navig(Bottle)} />
        <SectionButton { ...sections[3] } onPress={navig(MagicBall)} />
      </View>
      <View style={s.row}>
        <SectionButton { ...sections[4] } onPress={navig(Matches)} />
        <SectionButton { ...sections[5] } onPress={navig(Dices)} />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
})

Welcome.contextTypes = {
  navigate: PropTypes.func,
  back: PropTypes.func,
}
