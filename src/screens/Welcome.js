import React, { PropTypes } from 'react'
import { View, StyleSheet } from 'react-native'
import { SectionButton } from '../components/SectionButton'
import { Coin, Matches, Bottle, Numbers, Dices, MagicBall } from '.'

export const Welcome = (props, { navigate }) => {

  const data = [
    { title: 'Numbers',      color: '#79C753', Component: Numbers,   type: 'numbers' },
    { title: 'Coin',         color: '#F7786B', Component: Coin,      type: 'coin' },
    { title: 'Bottle',       color: '#B18F6A', Component: Bottle,    type: 'bottle' },
    { title: 'Magic 8-Ball', color: '#92B6D5', Component: MagicBall, type: 'ball' },
    { title: 'Matches',      color: '#FAE03C', Component: Matches,   type: 'matches' },
    { title: 'Dices',        color: '#B565A7', Component: Dices,     type: 'dice' },
  ]

  const sections = data.map(({ title, color, Component, type }) => ({
    onPress: () => navigate(() => <Component color={color} />),
    title, color, type,
  }))

  return (
    <View style={s.container}>
      <View style={s.row}>
        <SectionButton { ...sections[0] } />
        <SectionButton { ...sections[1] } />
      </View>
      <View style={s.row}>
        <SectionButton { ...sections[2] } />
        <SectionButton { ...sections[3] } />
      </View>
      <View style={s.row}>
        <SectionButton { ...sections[4] } />
        <SectionButton { ...sections[5] } />
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
