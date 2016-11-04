/*eslint-env jest, jasmine*/
import React from 'react'
import { View } from 'react-native'
import { shallow } from 'enzyme'
import { SectionTemplate } from './SectionTemplate'
import { ControlButton } from './ControlButton'
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
    const options = { number: { type: 'number' } }
    const wrapper = shallow(
      <SectionTemplate onBack={jest.fn()} options={options} onRefresh={jest.fn()} />
    )
    expect(wrapper.find(ControlButton).length).toBe(3)
  })

  it('should not render buttons if not needed', () => {
    const wrapper = shallow(
      <SectionTemplate />
    )
    expect(wrapper.find(ControlButton).length).toBe(0)
  })

  it('should render not render settings button', () => {
    const wrapper = shallow(
      <SectionTemplate />
    )
    expect(wrapper.find('ControlButton[type="settings"]').length).toBe(0)
  })

  it('should call onBack handler from props', () => {
    const onBack = jest.fn()
    const wrapper = shallow(
      <SectionTemplate onBack={onBack} />
    )
    wrapper.find('ControlButton[type="back"]').simulate('press')
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('should default back function from context', () => {
    const context = { back: jest.fn() }
    const wrapper = shallow(<SectionTemplate />, { context })
    wrapper.find('ControlButton[type="back"]').simulate('press')
    expect(context.back).toHaveBeenCalledTimes(1)
  })

  it('should call onRefresh handler', () => {
    const onRefresh = jest.fn()
    const wrapper = shallow(
      <SectionTemplate onRefresh={onRefresh} />
    )
    wrapper.find('ControlButton[type="refresh"]').simulate('press')
    expect(onRefresh).toHaveBeenCalledTimes(1)
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
    const onOptionsChange = jest.fn()
    const wrapper = shallow(
      <SectionTemplate options={options} onOptionsChange={onOptionsChange} />
    )
    const newOptions = {
      number: {
        type: 'number',
        value: 3,
      },
    }
    wrapper.find(UserOptions).simulate('change', newOptions)
    expect(onOptionsChange.mock.calls.length).toBe(1)
    expect(onOptionsChange.mock.calls[0][0]).toEqual(newOptions)
  })

})
