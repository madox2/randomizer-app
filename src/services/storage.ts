import AsyncStorage from '@react-native-async-storage/async-storage'
import {defaultData} from './defaultData'

// Same keys and value format as the previous version of the app so the
// settings saved on the device are kept after the update.
const appStore = new Map<string, string>(defaultData)

const VERSION = '@version'

/**
 * Merges the default data with the data saved on the device, respecting versions.
 */
export const mergeWithDevice = (
  deviceData: readonly (readonly [string, string | null])[],
): {merged: Map<string, string>; toPersist: [string, string][]} => {
  const merged = new Map(appStore)
  const device = new Map(deviceData)
  const toPersist: [string, string][] = []
  deviceData.forEach(([key, value]) => {
    const appVersion = Number(merged.get(`${key}${VERSION}`))
    const deviceVersion = Number(device.get(`${key}${VERSION}`))
    if (value === null || appVersion > deviceVersion || key.endsWith(VERSION)) {
      toPersist.push([key, appStore.get(key) as string])
    } else {
      merged.set(key, value)
    }
  })
  return {merged, toPersist}
}

let current = appStore

/**
 * Loads the saved data. Has to be awaited before the first read.
 */
const init = async (): Promise<void> => {
  try {
    const deviceData = await AsyncStorage.multiGet([...appStore.keys()])
    const {merged, toPersist} = mergeWithDevice(deviceData)
    current = merged
    await AsyncStorage.multiSet(toPersist)
  } catch (e) {
    // storage is not available, keep the defaults
    console.warn('Storage could not be loaded', e)
  }
}

const get = (key: string): string => current.get(key) as string
const getNumber = (key: string): number => Number(get(key))
const set = (key: string, value: unknown): void => {
  const stored = JSON.stringify(value)
  current.set(key, stored)
  AsyncStorage.setItem(key, stored).catch(() => undefined)
}

/**
 * App storage.
 */
export const storage = {init, get, getNumber, set}
