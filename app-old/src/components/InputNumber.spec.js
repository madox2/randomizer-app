/*eslint-env jest, jasmine*/
import React from 'react'
import {shallow} from 'enzyme'
import {InputNumber} from './InputNumber'
import {TextInput} from 'react-native'

function findByValue(wrapper, value) {
  return wrapper.find(TextInput).find(`[value="${value}"]`)
}

describe('<InputNumber />', () => {
  it('should render text input', () => {
    const wrapper = shallow(<InputNumber label="Number" value={13} />)
    expect(findByValue(wrapper, 13).length).toBe(1)
  })

  it('should trigger onChange event', () => {
    const onChange = jest.fn()
    const wrapper = shallow(
      <InputNumber label="Number" value={13} onChange={onChange} />,
    )
    const textinput = findByValue(wrapper, 13)
    textinput.simulate('changeText', '18')
    expect(onChange.mock.calls.length).toBe(1)
    expect(typeof onChange.mock.calls[0][0]).toBe('number')
    expect(onChange.mock.calls[0][0]).toBe(18)
  })

  it('should display validation error', () => {
    const onChange = jest.fn()
    const wrapper = shallow(
      <InputNumber
        label="Number"
        value={13}
        err={'some error'}
        onChange={onChange}
      />,
    )
    expect(wrapper.find('Error[children="some error"]').length).toBe(1)
  })
})

describe('InputNumber validation', () => {
  const valid = null
  const invalid = jasmine.any(String)

  const validateNumber = (value, constraints) => {
    const onChange = jest.fn()
    const wrapper = shallow(
      <InputNumber constraints={constraints} onChange={onChange} />,
    )
    wrapper.find(TextInput).simulate('changeText', value)
    return onChange.mock.calls[0][1]
  }

  it('should pass without options', () => {
    expect(validateNumber('3')).toEqual(valid)
  })

  it('should pass with empty options', () => {
    expect(validateNumber('-6', {})).toEqual(valid)
  })

  it('should reject floating numbers', () => {
    expect(validateNumber('3.14')).toEqual(invalid)
  })

  it('should be invalid minimal range', () => {
    expect(validateNumber('3', {min: 4})).toEqual(invalid)
  })

  it('should be invalid maximal range', () => {
    expect(validateNumber('8', {max: 4})).toEqual(invalid)
  })

  it('should pass all validations', () => {
    expect(validateNumber('8', {min: 4, max: 8})).toEqual(valid)
  })
})
