/*eslint-env jest, jasmine*/
import React from 'react'
import { shallow } from 'enzyme'
import { UserOptions } from './UserOptions'
import { View } from 'react-native'

const equalsText = text => w => w.text() === text

describe('<UserOptions />', () => {

  it('should render view', () => {
    const wrapper = shallow(<UserOptions />)
    expect(wrapper.type()).toBe(View)
  })

  it('should render options with default values', () => {
    const options = {
      number: {
        type: 'number',
        name: 'Number',
        defaultValue: 1,
      },
      myText: {
        type: 'text',
        name: 'My text',
        defaultValue: 'Hello world',
      },
    }
    const wrapper = shallow(<UserOptions options={options} />)
    expect(wrapper.findWhere(equalsText('Number: 1')).length).toBe(1)
    expect(wrapper.findWhere(equalsText('My text: Hello world')).length).toBe(1)
  })

  it('should render change button', () => {
    const wrapper = shallow(<UserOptions />)
    expect(wrapper.findWhere(equalsText('Change')).length).toBe(1)
  })

})
