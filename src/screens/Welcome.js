import React, { PropTypes } from 'react'
import { View } from 'react-native'
import { Link } from '../components/Link'
import { Coin, Matches, Bottle, Numbers, Dices, Custom } from '.'

export function Welcome(props, { navigate, back }) {

  const navig = Screen => () => navigate(() => (
    <View>
      <Screen />
      <Link navigate={back}>Back</Link>
    </View>
  ))

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
      <Link navigate={navig(Custom)}>
        Custom
      </Link>
    </View>
  )
}

Welcome.contextTypes = {
  navigate: PropTypes.func,
  back: PropTypes.func,
}
