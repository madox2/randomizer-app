import React, { PropTypes } from 'react'
import { View } from 'react-native'
import { Link } from '../components/Link'
import { Coin, Matches, Bottle, Numbers, Dices, MagicBall } from '.'

export const Welcome = (props, { navigate }) => {

  const navig = Screen => () => navigate(() => <Screen />)

  return (
    <View>
      <Link navigate={navig(Coin)}>
        Coin
      </Link>
      <Link navigate={navig(Matches)}>
        Matches
      </Link>
      <Link navigate={navig(Bottle)}>
        Bottle
      </Link>
      <Link navigate={navig(Numbers)}>
        Numbers
      </Link>
      <Link navigate={navig(Dices)}>
        Dices
      </Link>
      <Link navigate={navig(MagicBall)}>
        Magic 8-Ball
      </Link>
    </View>
  )
}

Welcome.contextTypes = {
  navigate: PropTypes.func,
  back: PropTypes.func,
}
