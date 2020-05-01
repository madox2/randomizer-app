/*eslint-env jest, jasmine*/
import React from 'react'
import {shallow} from 'enzyme'
import {SectionButton} from './SectionButton'
import {TouchableOpacity} from 'react-native'

describe('<SectionButton />', () => {
  it('should render title', () => {
    const wrapper = shallow(<SectionButton title="Matches" />)
    expect(wrapper.find('[children="Matches"]').length).toBe(1)
  })

  it('should trigger onPress event', () => {
    const onPress = jest.fn()
    const wrapper = shallow(<SectionButton title="Matches" onPress={onPress} />)
    wrapper.find(TouchableOpacity).simulate('press')
    expect(onPress).toBeCalled()
  })
})
