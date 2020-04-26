/*eslint-env jest, jasmine*/

import {
  randomNumber,
  randomBoolean,
  randomColor,
  uniqueRandomNumbers,
} from './random'

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
    const min = 10
    const max = 5
    randomSpy.and.returnValue(0)
    expect(randomNumber(min, max)).toBe(max)
    randomSpy.and.returnValue(0.9999)
    expect(randomNumber(min, max)).toBe(min)
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

describe('randomColor', () => {
  it('should return color string', () => {
    expect(typeof randomColor()).toBe('string')
    expect(randomColor().length).toBe(7)
    expect(randomColor()[0]).toBe('#')
  })
})

describe('uniqueRandomNumbers', () => {
  it('should return two unique numbers', () => {
    const numbers = uniqueRandomNumbers(0, 5, 2)
    expect(numbers.length).toBe(2)
    expect(numbers[0] >= 0 && numbers[0] <= 5).toBe(true)
    expect(numbers[1] >= 0 && numbers[1] <= 5).toBe(true)
  })

  it('should return all unique numbers', () => {
    const numbers = uniqueRandomNumbers(2, 7, 6)
    expect(numbers.length).toBe(6)
    for (let i = 2; i <= 7; i++) {
      expect(!!~numbers.indexOf(i)).toBe(true)
    }
  })
})
