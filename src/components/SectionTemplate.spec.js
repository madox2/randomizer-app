/*eslint-env jest, jasmine*/
import React from 'react'
import { View } from 'react-native'
import { shallow } from 'enzyme'
import { SectionTemplate, Button } from './SectionTemplate'
import { UserOptions } from './UserOptions'

describe('<SectionTemplate />', () => {

  it('should render children', () => {
    const Child = () => View
    const wrapper = shallow(
      <SectionTemplate>
        <Child />
      </SectionTemplate>
    )
    expect(wrapper.find(Child).length).toBe(1)
  })

  it('should render all buttons', () => {
    const wrapper = shallow(
      <SectionTemplate onBack={jest.fn()} onFire={jest.fn()} onReset={jest.fn()} />
    )
    expect(wrapper.find(Button).length).toBe(3)
  })

  it('should not render buttons if not needed', () => {
    const wrapper = shallow(
      <SectionTemplate />
    )
    expect(wrapper.find(Button).length).toBe(0)
  })

  it('should call onBack handler from props', () => {
    const onBack = jest.fn()
    const wrapper = shallow(
      <SectionTemplate onBack={onBack} />
    )
    wrapper.find('Button[children="Back"]').simulate('press')
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('should default back function from context', () => {
    const context = { back: jest.fn() }
    const wrapper = shallow(<SectionTemplate />, { context })
    wrapper.find('Button[children="Back"]').simulate('press')
    expect(context.back).toHaveBeenCalledTimes(1)
  })

  it('should call onFire handler', () => {
    const onFire = jest.fn()
    const wrapper = shallow(
      <SectionTemplate onFire={onFire} />
    )
    wrapper.find('Button[children="Fire"]').simulate('press')
    expect(onFire).toHaveBeenCalledTimes(1)
  })

  it('should call onReset handler', () => {
    const onReset = jest.fn()
    const wrapper = shallow(
      <SectionTemplate onReset={onReset} />
    )
    wrapper.find('Button[children="Reset"]').simulate('press')
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('should display user options', () => {
    const options = { number: { type: 'number' } }
    const wrapper = shallow(
      <SectionTemplate options={options} />
    )
    expect(wrapper.find(UserOptions).length).toBe(1)
    expect(wrapper.find(UserOptions).prop('options')).toEqual(options)
  })

  it('should trigger onOptionsChange event', () => {
    const options = { number: { type: 'number' } }
    const onOptionChange = jest.fn()
    const wrapper = shallow(
      <SectionTemplate options={options} onOptionChange={onOptionChange} />
    )
    const newOptions = {
      number: {
        type: 'number',
        value: 3,
      },
    }
    wrapper.find(UserOptions).simulate('change', newOptions)
    expect(onOptionChange.mock.calls.length).toBe(1)
    expect(onOptionChange.mock.calls[0][0]).toEqual(newOptions)
  })

})
