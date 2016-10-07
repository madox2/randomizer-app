import 'react-native'
import React from 'react'
import { View, Text } from 'react-native'

import { shallow } from 'enzyme'

const Demo = () => (
  <View>
    <Text>Hello world</Text>
  </View>
)

describe('sample test', () => {

  it('should pass', () => {
    const wrapper = shallow(<Demo />)
    const text = wrapper.find(Text)
    expect(text.length).toBe(1)
    expect(text.get(0)).toEqual(
      <Text>Hello world</Text>
    )
  })

})
