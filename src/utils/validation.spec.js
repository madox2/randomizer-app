/*eslint-env jest, jasmine*/
import { validateNumber } from './validation'

const valid = { valid: true }
const invalid = { valid: false, err: jasmine.any(String) }

describe('validateNumber', () => {

  it('should pass without options', () => {
    expect(validateNumber(3)).toEqual(valid)
  })

  it('should pass with empty options', () => {
    expect(validateNumber(-6, {})).toEqual(valid)
  })

  it('should reject value passed as string', () => {
    expect(validateNumber('55')).toEqual(invalid)
  })

  it('should reject floating numbers', () => {
    expect(validateNumber(3.14)).toEqual(invalid)
  })

  it('should be invalid minimal range', () => {
    expect(validateNumber(3, { min: 4 })).toEqual(invalid)
  })

  it('should be invalid maximal range', () => {
    expect(validateNumber(8, { max: 4 })).toEqual(invalid)
  })

  it('should pass all validations', () => {
    expect(validateNumber(8, { min: 4, max: 8 })).toEqual(valid)
  })

})
