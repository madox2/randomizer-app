/* Optimized (smaller) images for web. */
export const images = {
  bottle: require('./images-web/bottle.png'),
  coin0: require('./images-web/coin-0.png'),
  coin1: require('./images-web/coin-1.png'),
  dice1: require('./images-web/dice1.png'),
  dice2: require('./images-web/dice2.png'),
  dice3: require('./images-web/dice3.png'),
  dice4: require('./images-web/dice4.png'),
  dice5: require('./images-web/dice5.png'),
  dice6: require('./images-web/dice6.png'),
  ball: require('./images-web/ball.png'),
  ballTriangle: require('./images-web/ball-triangle.png'),
  match: require('./images-web/match.png'),
  matchBurned: require('./images-web/match-burned.png'),
}

export const icons = {
  numbers: require('./icons-web/numbers.png'),
  coin: require('./icons-web/coin.png'),
  bottle: require('./icons-web/bottle.png'),
  ball: require('./icons-web/ball.png'),
  matches: require('./icons-web/matches.png'),
  dice: require('./icons-web/dice.png'),
  back: require('./icons-web/back.png'),
  refresh: require('./icons-web/refresh.png'),
  settings: require('./icons-web/settings.png'),
  help: require('./icons-web/help.png'),
}

export type IconName = keyof typeof icons
