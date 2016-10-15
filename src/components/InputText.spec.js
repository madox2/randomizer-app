/*eslint-env jest, jasmine*/
import React from 'react'
import { shallow } from 'enzyme'
import { InputText } from './InputText'

describe('<InputText />', () => {

  it('should render text input', () => {
    const wrapper = shallow(
      <InputText label='Number' value='hello' />
    )
    expect(wrapper.find('TextInput[value="hello"]').length).toBe(1)
  })

  it('should trigger onChange event', () => {
    const onChange = jest.fn()
    const wrapper = shallow(
      <InputText label='Number' value='hello' onChange={onChange} />
    )
    const textinput = wrapper.find('TextInput[value="hello"]')
    textinput.simulate('changeText', 'world')
    expect(onChange.mock.calls.length).toBe(1)
    expect(onChange.mock.calls[0][0]).toBe('world')
  })

})
