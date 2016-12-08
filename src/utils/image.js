import { Platform } from 'react-native'

// TODO: react-native-web does not support loading images using `require`
// FIXME: apply/create webpack loader?
// https://github.com/necolas/react-native-web/issues/237

const sourcesRequire = Platform.OS === 'web' ? {} : {
  'images/bottle.png': require('../resources/images/bottle.png'),
  'images/coin0.png': require('../resources/images/coin0.png'),
  'images/coin1.png': require('../resources/images/coin1.png'),
  'images/dice1.png': require('../resources/images/dice1.png'),
  'images/dice2.png': require('../resources/images/dice2.png'),
  'images/dice3.png': require('../resources/images/dice3.png'),
  'images/dice4.png': require('../resources/images/dice4.png'),
  'images/dice5.png': require('../resources/images/dice5.png'),
  'images/dice6.png': require('../resources/images/dice6.png'),
  'images/ball.png': require('../resources/images/ball.png'),
  'images/ball-triangle.png': require('../resources/images/ball-triangle.png'),
  'images/match.png': require('../resources/images/match.png'),
  'images/match-burned.png': require('../resources/images/match-burned.png'),
  'icons/numbers.png': require('../resources/icons/numbers.png'),
  'icons/coin.png': require('../resources/icons/coin.png'),
  'icons/bottle.png': require('../resources/icons/bottle.png'),
  'icons/ball.png': require('../resources/icons/ball.png'),
  'icons/matches.png': require('../resources/icons/matches.png'),
  'icons/dice.png': require('../resources/icons/dice.png'),
  'icons/back.png': require('../resources/icons/back.png'),
  'icons/refresh.png': require('../resources/icons/refresh.png'),
  'icons/settings.png': require('../resources/icons/settings.png'),
}

export function resource(uri) {
  if (Platform.OS === 'web') {
    return { uri: '../resources/' + uri }
  }
  return sourcesRequire[uri]
}
