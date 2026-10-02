/* Full quality images for native platforms. */
export const images = {
  bottle: require('./images/bottle.png'),
  coin0: require('./images/coin-0.png'),
  coin1: require('./images/coin-1.png'),
  dice1: require('./images/dice1.png'),
  dice2: require('./images/dice2.png'),
  dice3: require('./images/dice3.png'),
  dice4: require('./images/dice4.png'),
  dice5: require('./images/dice5.png'),
  dice6: require('./images/dice6.png'),
  ball: require('./images/ball.png'),
  ballTriangle: require('./images/ball-triangle.png'),
  match: require('./images/match.png'),
  matchBurned: require('./images/match-burned.png'),
}

export const icons = {
  numbers: require('./icons/numbers.png'),
  coin: require('./icons/coin.png'),
  bottle: require('./icons/bottle.png'),
  ball: require('./icons/ball.png'),
  matches: require('./icons/matches.png'),
  dice: require('./icons/dice.png'),
  back: require('./icons/back.png'),
  refresh: require('./icons/refresh.png'),
  settings: require('./icons/settings.png'),
  help: require('./icons/help.png'),
}

export type IconName = keyof typeof icons
