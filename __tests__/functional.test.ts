import {mapProps, reduceProps, someProp} from '../src/utils/functional'

describe('mapProps', () => {
  it('maps object properties ordered by key', () => {
    expect(mapProps({c: 4, a: 2, b: 3}, ([key, prop]) => key + prop)).toEqual([
      'a2',
      'b3',
      'c4',
    ])
  })
})

describe('reduceProps', () => {
  it('reduces object properties', () => {
    expect(reduceProps({a: 2, b: 3}, (_, k) => k)).toEqual({a: 'a', b: 'b'})
  })
})

describe('someProp', () => {
  it('finds a matching prop', () => {
    expect(someProp({a: 2, b: 3}, (v) => v === 2)).toBe(true)
  })

  it('does not find a matching prop', () => {
    expect(someProp({a: 2, b: 3}, (v) => v === 8)).toBe(false)
  })
})
