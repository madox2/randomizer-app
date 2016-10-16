/*eslint-env jest, jasmine*/

import { randomNumber, randomBoolean } from './random'

describe('randomNumber', () => {

  let randomSpy

  const testRange = (min, max) => {
    randomSpy.and.returnValue(0)
    expect(randomNumber(min, max)).toBe(min)
    randomSpy.and.returnValue(0.9999)
    expect(randomNumber(min, max)).toBe(max)
    randomSpy.and.returnValue(0.5)
    expect(randomNumber(min, max)).toBeLessThan(max + 1)
    expect(randomNumber(min, max)).toBeGreaterThan(min - 1)
  }

  beforeEach(() => {
    randomSpy = spyOn(Math, 'random')
  })

  it('should return random number in range for positive numbers', () => {
    testRange(10, 15)
  })

  it('should return random number in range for negative numbers', () => {
    testRange(-15, -10)
  })

  it('should return random number in range for negative and positive numbers', () => {
    testRange(-10, 15)
  })

  it('should return correct number for small range', () => {
    testRange(10, 11)
  })

  it('should return correct nubers for reverse argument order', () => {
    testRange(5, 9)
  })

})

describe('randomBoolean', () => {

  let randomSpy

  beforeEach(() => {
    randomSpy = spyOn(Math, 'random')
  })

  it('should return true', () => {
    randomSpy.and.returnValue(0.1)
    expect(randomBoolean()).toBe(false)
    randomSpy.and.returnValue(0.4999)
    expect(randomBoolean()).toBe(false)
  })

  it('should return false', () => {
    randomSpy.and.returnValue(0.9)
    expect(randomBoolean()).toBe(true)
    randomSpy.and.returnValue(0.5)
    expect(randomBoolean()).toBe(true)
  })

})
