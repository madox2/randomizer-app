/*eslint-env jest, jasmine*/
import React from 'react'
import {shallow} from 'enzyme'
import {ControlButton} from './ControlButton'

describe('<ControlButton />', () => {
  it('should render image', () => {
    const wrapper = shallow(<ControlButton type="back" />)
    const image = wrapper.find('Image')
    expect(image.length).toBe(1)
  })

  it('should trigger onPress event', () => {
    const onPress = jest.fn()
    const wrapper = shallow(<ControlButton type="back" onPress={onPress} />)
    wrapper.find('TouchableOpacity').simulate('press')
    expect(onPress).toBeCalled()
  })
})
