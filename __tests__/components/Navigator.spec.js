import React from 'react'
import { View } from 'react-native'
import { shallow } from 'enzyme'
import { Navigator } from '../../src/components/Navigator'

describe('<Navigator />', () => {

  const Root = () => <View />
  const Next = () => <View />

  it('should render root element', () => {
    const wrapper = shallow(<Navigator root={Root} />)
    expect(wrapper.get(0)).toEqual(<Root />)
  })

  it('should expose `navigate` and `back` functions to the context', () => {
    const instance = shallow(<Navigator root={View} />).instance()
    expect(instance.getChildContext()).toEqual({
      navigate: jasmine.any(Function),
      back: jasmine.any(Function),
    })
  })

  it('should navigate to the new screen', () => {
    const wrapper = shallow(<Navigator root={Root} />)
    wrapper.instance().getChildContext().navigate(Next)
    wrapper.update()
    expect(wrapper.get(0)).toEqual(<Next />)
  })

  it('should navigate back', () => {
    const wrapper = shallow(<Navigator root={Root} />)
    wrapper.instance().getChildContext().navigate(Next)
    wrapper.update()
    wrapper.instance().getChildContext().back()
    wrapper.update()
    expect(wrapper.get(0)).toEqual(<Root />)
  })

  it('should not navigate back when it is not possible', () => {
    const wrapper = shallow(<Navigator root={Root} />)
    wrapper.instance().getChildContext().back()
    wrapper.update()
    expect(wrapper.get(0)).toEqual(<Root />)
  })

})
