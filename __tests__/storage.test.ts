jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
)

import AsyncStorage from '@react-native-async-storage/async-storage'
import {mergeWithDevice, storage} from '../src/services/storage'

describe('storage', () => {
  beforeEach(() => AsyncStorage.clear())

  it('provides defaults when nothing is saved', async () => {
    await storage.init()
    expect(storage.getNumber('Dices.count')).toBe(4)
    expect(storage.getNumber('Numbers.to')).toBe(100)
    expect(storage.get('Info.coin')).toBe('Grab the coin with finger and throw it')
  })

  it('restores saved values', async () => {
    await AsyncStorage.multiSet([
      ['Dices.count', '7'],
      ['Dices.count@version', '1'],
    ])
    await storage.init()
    expect(storage.getNumber('Dices.count')).toBe(7)
  })

  it('persists values in a format compatible with the previous version', async () => {
    await storage.init()
    storage.set('Numbers.to', 250)
    expect(storage.getNumber('Numbers.to')).toBe(250)
    expect(await AsyncStorage.getItem('Numbers.to')).toBe('250')
  })

  it('replaces a saved value by a default with a newer version', async () => {
    await AsyncStorage.multiSet([
      ['Info.coin', 'old text'],
      ['Info.coin@version', '0'],
    ])
    await storage.init()
    expect(storage.get('Info.coin')).toBe('Grab the coin with finger and throw it')
  })
})

describe('mergeWithDevice', () => {
  it('writes defaults for the missing keys', () => {
    const {merged, toPersist} = mergeWithDevice([
      ['Dices.count', null],
      ['Dices.count@version', null],
    ])
    expect(merged.get('Dices.count')).toBe('4')
    expect(toPersist).toEqual([
      ['Dices.count', '4'],
      ['Dices.count@version', '1'],
    ])
  })
})
