const sourcesRequire = {
  'images/bottle.png': require('../resources/images/bottle.png'),
  'images/coin-0.png': require('../resources/images/coin-0.png'),
  'images/coin-1.png': require('../resources/images/coin-1.png'),
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
  'icons/info.png': require('../resources/icons/info.png'),
}

export function resource(uri) {
  return sourcesRequire[uri]
}
