import {sanitize, validate} from '../src/utils/validate'

describe('sanitize', () => {
  it('converts integer text to a number', () => {
    expect(sanitize('18')).toBe(18)
    expect(sanitize('-6')).toBe(-6)
    expect(sanitize('0')).toBe(0)
  })

  it('keeps text which is not a canonical integer', () => {
    expect(sanitize('')).toBe('')
    expect(sanitize('-')).toBe('-')
    expect(sanitize('007')).toBe('007')
    expect(sanitize('3.14')).toBe('3.14')
    expect(sanitize('1e3')).toBe('1e3')
  })
})

describe('validate', () => {
  it('passes without constraints', () => {
    expect(validate(3)).toBeNull()
    expect(validate(-6, {})).toBeNull()
  })

  it('rejects an empty value', () => {
    expect(validate('')).toBe('Cannot be empty')
  })

  it('rejects invalid numbers', () => {
    expect(validate('3.14')).toBe('Invalid number format')
    expect(validate('007')).toBe('Invalid number format')
    expect(validate(Number.MAX_SAFE_INTEGER + 1)).toBe('Invalid number format')
  })

  it('checks the minimum', () => {
    expect(validate(3, {min: 4})).toBe('Minimum value is 4')
    expect(validate(4, {min: 4})).toBeNull()
  })

  it('checks the maximum', () => {
    expect(validate(8, {max: 4})).toBe('Maximum value is 4')
    expect(validate(4, {max: 4})).toBeNull()
  })

  it('passes all constraints', () => {
    expect(validate(8, {min: 4, max: 8})).toBeNull()
  })
})
