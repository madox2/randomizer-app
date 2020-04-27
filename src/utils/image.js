// use minified version for web
const sourcesRequire = {
  'images/bottle.png': require('../resources/images/bottle-min.png'),
  'images/coin-0.png': require('../resources/images/coin-0-min.png'),
  'images/coin-1.png': require('../resources/images/coin-1-min.png'),
  'images/dice1.png': require('../resources/images/dice1-min.png'),
  'images/dice2.png': require('../resources/images/dice2-min.png'),
  'images/dice3.png': require('../resources/images/dice3-min.png'),
  'images/dice4.png': require('../resources/images/dice4-min.png'),
  'images/dice5.png': require('../resources/images/dice5-min.png'),
  'images/dice6.png': require('../resources/images/dice6-min.png'),
  'images/ball.png': require('../resources/images/ball-min.png'),
  'images/ball-triangle.png': require('../resources/images/ball-triangle-min.png'),
  'images/match.png': require('../resources/images/match-min.png'),
  'images/match-burned.png': require('../resources/images/match-burned-min.png'),
  'icons/numbers.png': require('../resources/icons/numbers-min.png'),
  'icons/coin.png': require('../resources/icons/coin-min.png'),
  'icons/bottle.png': require('../resources/icons/bottle-min.png'),
  'icons/ball.png': require('../resources/icons/ball-min.png'),
  'icons/matches.png': require('../resources/icons/matches-min.png'),
  'icons/dice.png': require('../resources/icons/dice-min.png'),
  'icons/back.png': require('../resources/icons/back-min.png'),
  'icons/refresh.png': require('../resources/icons/refresh-min.png'),
  'icons/settings.png': require('../resources/icons/settings-min.png'),
  'icons/help.png': require('../resources/icons/help-min.png'),
}

export function resource(uri) {
  return sourcesRequire[uri].default
}
