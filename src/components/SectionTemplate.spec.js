/*eslint-env jest, jasmine*/
import React from 'react'
import { View } from 'react-native'
import { shallow } from 'enzyme'
import { SectionTemplate, Button } from './SectionTemplate'

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
      <SectionTemplate back={jest.fn()} fire={jest.fn()} reset={jest.fn()} />
    )
    expect(wrapper.find(Button).length).toBe(3)
  })

  it('should not render buttons if not needed', () => {
    const wrapper = shallow(
      <SectionTemplate />
    )
    expect(wrapper.find(Button).length).toBe(0)
  })

  it('should call back function from props', () => {
    const back = jest.fn()
    const wrapper = shallow(
      <SectionTemplate back={back} />
    )
    wrapper.find(Button, { onPress: back }).simulate('press')
    expect(back).toHaveBeenCalledTimes(1)
  })

  it('should call default back function from context', () => {
    const context = { back: jest.fn() }
    const wrapper = shallow(<SectionTemplate />, { context })
    wrapper.find(Button, { onPress: context.back }).simulate('press')
    expect(context.back).toHaveBeenCalledTimes(1)
  })

  it('should call fire function', () => {
    const fire = jest.fn()
    const wrapper = shallow(
      <SectionTemplate fire={fire} />
    )
    wrapper.find(Button, { onPress: fire }).simulate('press')
    expect(fire).toHaveBeenCalledTimes(1)
  })

  it('should call reset function', () => {
    const reset = jest.fn()
    const wrapper = shallow(
      <SectionTemplate reset={reset} />
    )
    wrapper.find(Button, { onPress: reset }).simulate('press')
    expect(reset).toHaveBeenCalledTimes(1)
  })

})
