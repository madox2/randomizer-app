/*eslint-env jest, jasmine*/
import React from 'react'
import { shallow } from 'enzyme'
import { InputNumber } from './InputNumber'

describe('<InputNumber />', () => {

  it('should render text input', () => {
    const wrapper = shallow(
      <InputNumber label='Number' value={13} />
    )
    expect(wrapper.find('TextInput[value="13"]').length).toBe(1)
  })

  it('should trigger onChange event', () => {
    const onChange = jest.fn()
    const wrapper = shallow(
      <InputNumber label='Number' value={13} onChange={onChange} />
    )
    const textinput = wrapper.find('TextInput[value="13"]')
    textinput.simulate('changeText', '18')
    expect(onChange.mock.calls.length).toBe(1)
    expect(typeof onChange.mock.calls[0][0]).toBe('number')
    expect(onChange.mock.calls[0][0]).toBe(18)
  })

})
