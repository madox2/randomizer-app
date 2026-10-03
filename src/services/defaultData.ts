/**
 * Default storage data: [key, value, version].
 * A stored value is replaced by the default when the default has a newer version.
 */
export type DefaultEntry = [key: string, value: string, version?: number]

const data: DefaultEntry[] = [
  // game default data
  ['Dices.count', '4', 1],
  ['Dices.sides', '6', 1],
  ['Matches.count', '4', 1],
  ['Matches.burnedCount', '1', 1],
  ['Numbers.from', '0', 1],
  ['Numbers.to', '100', 1],
  ['Teams.count', '2', 1],
  ['Teams.players', '[]', 1],
  // info texts
  ['Info.numbers', 'Touch to start and touch again to stop', 1],
  ['Info.coin', 'Grab the coin with finger and throw it', 1],
  ['Info.bottle', 'Spin the bottle with finger', 1],
  ['Info.ball', 'Touch the screen and wait for the answer', 1],
  ['Info.matches', 'Pull the match up to find a burned one', 1],
  ['Info.dice', 'Touch to throw all dices', 1],
  // last dismissed versions of the info texts on the device
  ['Info.numbers.dismissedVersion', '0'],
  ['Info.coin.dismissedVersion', '0'],
  ['Info.bottle.dismissedVersion', '0'],
  ['Info.ball.dismissedVersion', '0'],
  ['Info.matches.dismissedVersion', '0'],
  ['Info.dice.dismissedVersion', '0'],
]

/**
 * Expands the entries to key - value pairs including the `<key>@version` keys.
 */
export const defaultData: [string, string][] = data.flatMap(
  ([key, value, version]): [string, string][] => [
    [key, value],
    [`${key}@version`, String(version ?? 0)],
  ],
)
