const data = [
  ['Dices.count', '4'],
  ['Matches.count', '4'],
  ['Numbers.from', '0'],
  ['Numbers.to', '100'],
]

const store = new Map(data)

const get = key => store.get(key)

const set = (key, value) => store.set(key, value)

const getNumber = key => Number(get(key))

const getBoolean = key => !!get(key)

/**
 * App storage.
 */
export const storage = { get, set, getNumber, getBoolean }

