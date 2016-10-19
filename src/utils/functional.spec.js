/*eslint-env jest, jasmine*/
import { mapProps, reduceProps, someProp } from './functional'

describe('mapProps', () => {

  it('should map object properties', () => {
    expect(mapProps({ a: 2, b: 3, c: 4 }, ([ key, prop ]) => (key + prop)))
      .toEqual([ 'a2', 'b3', 'c4' ])
  })

})

describe('reduceProps', () => {

  it('should reduce object properties', () => {
    expect(reduceProps({ a: 2, b: 3, c: 4 }, (v, k) => (k)))
      .toEqual({ a: 'a', b: 'b', c: 'c' })
  })

})

describe('someProp', () => {

  it('should find matching prop', () => {
    expect(someProp({ a: 2, b: 3, c: 4 }, v => v === 2))
      .toBe(true)
  })

  it('should not find matching prop', () => {
    expect(someProp({ a: 2, b: 3, c: 4 }, v => v === 8))
      .toBe(false)
  })

})
