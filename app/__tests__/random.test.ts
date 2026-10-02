import {
  randomBoolean,
  randomColor,
  randomNumber,
  uniqueRandomNumbers,
} from '../src/utils/random'

describe('randomNumber', () => {
  let random: jest.SpyInstance
  beforeEach(() => {
    random = jest.spyOn(Math, 'random')
  })
  afterEach(() => random.mockRestore())

  const testRange = (min: number, max: number) => {
    random.mockReturnValue(0)
    expect(randomNumber(min, max)).toBe(min)
    random.mockReturnValue(0.9999)
    expect(randomNumber(min, max)).toBe(max)
    random.mockReturnValue(0.5)
    expect(randomNumber(min, max)).toBeLessThan(max + 1)
    expect(randomNumber(min, max)).toBeGreaterThan(min - 1)
  }

  it('returns a number in range for positive numbers', () => testRange(10, 15))
  it('returns a number in range for negative numbers', () => testRange(-15, -10))
  it('returns a number in range for mixed numbers', () => testRange(-10, 15))
  it('returns correct numbers for a small range', () => testRange(10, 11))

  it('accepts the reverse argument order', () => {
    random.mockReturnValue(0)
    expect(randomNumber(10, 5)).toBe(5)
    random.mockReturnValue(0.9999)
    expect(randomNumber(10, 5)).toBe(10)
  })
})

describe('randomBoolean', () => {
  let random: jest.SpyInstance
  beforeEach(() => {
    random = jest.spyOn(Math, 'random')
  })
  afterEach(() => random.mockRestore())

  it('returns false below one half', () => {
    random.mockReturnValue(0.1)
    expect(randomBoolean()).toBe(false)
    random.mockReturnValue(0.4999)
    expect(randomBoolean()).toBe(false)
  })

  it('returns true from one half', () => {
    random.mockReturnValue(0.5)
    expect(randomBoolean()).toBe(true)
    random.mockReturnValue(0.9)
    expect(randomBoolean()).toBe(true)
  })
})

describe('randomColor', () => {
  it('returns a dark blue hex color', () => {
    for (let i = 0; i < 200; i++) {
      const color = randomColor()
      expect(color).toMatch(/^#[0-9a-f]{6}$/)
      const [r, g, b] = [1, 3, 5].map((k) => parseInt(color.slice(k, k + 2), 16))
      // the color is dark and not red
      expect(Math.max(r, g, b)).toBeLessThan(0.6 * 255)
      expect(r).toBeLessThan(Math.max(g, b))
    }
  })
})

describe('uniqueRandomNumbers', () => {
  it('returns two unique numbers', () => {
    const numbers = uniqueRandomNumbers(0, 5, 2)
    expect(numbers).toHaveLength(2)
    expect(new Set(numbers).size).toBe(2)
    numbers.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThanOrEqual(5)
    })
  })

  it('returns all numbers of the range', () => {
    expect(uniqueRandomNumbers(2, 7, 6).sort()).toEqual([2, 3, 4, 5, 6, 7])
  })
})
