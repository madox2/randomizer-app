import { AsyncStorage } from 'react-native'

// [[key, value, version], ...]
const defaultData = [
  ['Dices.count', '4', '1'],
  ['Matches.count', '4', '1'],
  ['Numbers.from', '0', '1'],
  ['Numbers.to', '100', '1'],
]
const reduceVersions = data => data.reduce((r, [key, value, version]) => {
  return r.concat([[key, value], [`${key}@version`, version]])
}, [])
const appStore = new Map(reduceVersions(defaultData))

// merge default data and phone storage with respect to versions
const initialize = data => {
  const deviceStore = new Map(data)
  data.forEach(([key, value]) => {
    const appVersion = appStore.get(`${key}@version`)
    const deviceVersion = deviceStore.get(`${key}@version`)
    if (value === null || appVersion > deviceVersion || key.endsWith('@version')) {
      AsyncStorage.setItem(key, appStore.get(key))
    } else {
      appStore.set(key, value)
    }
  })
}

AsyncStorage.multiGet([...appStore.keys()]).then(initialize)

const get = key => appStore.get(key)
const set = (key, value) => {
  appStore.set(key, value)
  AsyncStorage.setItem(key, JSON.stringify(value))
}
const getNumber = key => Number(get(key))
const getBoolean = key => !!get(key)

/**
 * App storage.
 */
export const storage = { get, set, getNumber, getBoolean }

