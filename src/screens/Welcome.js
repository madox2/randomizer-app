import React, { PropTypes } from 'react'
import { View } from 'react-native'
import { SectionButton } from '../components/SectionButton'
import { Coin, Matches, Bottle, Numbers, Dices, MagicBall } from './index'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

export const Welcome = (props, { navigate }) => {

  const data = [
    { title: 'Numbers',      color: '#f9be3e', bColor: '#d89c19', Component: Numbers,   type: 'numbers' },
    { title: 'Coin',         color: '#067b82', bColor: '#07565a', Component: Coin,      type: 'coin' },
    { title: 'Bottle',       color: '#f06060', bColor: '#c33939', Component: Bottle,    type: 'bottle' },
    { title: 'Magic 8-Ball', color: '#86a73f', bColor: '#5d7d17', Component: MagicBall, type: 'ball' },
    { title: 'Matches',      color: '#92c2b8', bColor: '#63a094', Component: Matches,   type: 'matches' },
    { title: 'Dices',        color: '#e5a959', bColor: '#c78123', Component: Dices,     type: 'dice' },
  ]

  const sections = data.map(({ title, color, bColor, Component, type }) => ({
    onPress: () => navigate(() => <Component color={color} buttonColor={bColor} />),
    title, color, type,
  }))

  const s = makeStyles()

  return (
    <View style={s.container}>
      <View style={s.row}>
        <SectionButton { ...sections[0] } />
        <View style={s.vdivider} />
        <SectionButton { ...sections[1] } />
      </View>
      <View style={s.hdivider} />
      <View style={s.row}>
        <SectionButton { ...sections[2] } />
        <View style={s.vdivider} />
        <SectionButton { ...sections[3] } />
      </View>
      <View style={s.hdivider} />
      <View style={s.row}>
        <SectionButton { ...sections[4] } />
        <View style={s.vdivider} />
        <SectionButton { ...sections[5] } />
      </View>
    </View>
  )
}

const makeStyles = ResponsiveStyleSheet.create(({ dividerWidth }) => ({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  vdivider: {
    width: dividerWidth,
  },
  hdivider: {
    height: dividerWidth,
  },
}))

Welcome.contextTypes = {
  navigate: PropTypes.func,
  back: PropTypes.func,
}
