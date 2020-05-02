/**
 * Default storage data with versions [[key, value, version], ...]
 */
const data = [
  // game default data
  ['Dices.count', '4', '1'],
  ['Dices.sides', '6', '1'],
  ['Matches.count', '4', '1'],
  ['Matches.burnedCount', '1', '1'],
  ['Numbers.from', '0', '1'],
  ['Numbers.to', '100', '1'],
  // info texts
  ['Info.numbers', 'Touch to start and touch again to stop', 1],
  ['Info.coin', 'Grab the coin with finger and throw it', 1],
  ['Info.bottle', 'Spin the bottle with finger', 1],
  ['Info.ball', 'Touch the screen and wait for the answer', 1],
  ['Info.matches', 'Pull the match up to find a burned one', 1],
  ['Info.dice', 'Touch to throw all dices', 1],
  // last dismissed versions of device
  ['Info.numbers.dismissedVersion', '0'],
  ['Info.coin.dismissedVersion', '0'],
  ['Info.bottle.dismissedVersion', '0'],
  ['Info.ball.dismissedVersion', '0'],
  ['Info.matches.dismissedVersion', '0'],
  ['Info.dice.dismissedVersion', '0'],
]

/**
 * reduces storage values and versions to array of key - value pairs
 */
const reduceVersions = (d) =>
  d.reduce((r, [key, value, version]) => {
    return r.concat([
      [key, value],
      [`${key}@version`, (version || 0).toString()],
    ])
  }, [])

export const defaultData = reduceVersions(data)
