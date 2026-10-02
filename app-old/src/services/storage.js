import {AsyncStorage} from './AsyncStorage'
import {defaultData} from './defaultData'

let appStore // cached store data structure

initialize(defaultData)

const get = (key) => appStore.get(key)
const set = (key, value) => {
  const strVal = JSON.stringify(value)
  appStore.set(key, strVal)
  AsyncStorage.setItem(key, strVal)
}
const getNumber = (key) => Number(get(key))
const getBoolean = (key) => !!get(key)

/**
 * App storage.
 */
export const storage = {get, set, getNumber, getBoolean}

function initialize() {
  appStore = new Map(defaultData)
  AsyncStorage.multiGet([...appStore.keys()]).then(mergeWithVersions)
}

// merge default data and phone storage with respect to versions
function mergeWithVersions(data) {
  const deviceStore = new Map(data)
  data.forEach(([key, value]) => {
    const appVersion = appStore.get(`${key}@version`)
    const deviceVersion = deviceStore.get(`${key}@version`)
    if (
      value === null ||
      appVersion > deviceVersion ||
      key.endsWith('@version')
    ) {
      AsyncStorage.setItem(key, appStore.get(key))
    } else {
      appStore.set(key, value)
    }
  })
}
