/*eslint-env jest, jasmine*/
import React from 'react'
import { shallow } from 'enzyme'
import { UserOptions } from './UserOptions'
import { View } from 'react-native'

describe('<UserOptions />', () => {

  it('should render view', () => {
    const wrapper = shallow(<UserOptions />)
    expect(wrapper.type()).toBe(View)
  })

  it('should render options with default values', () => {
    const options = {
      number: {
        type: 'number',
        label: 'Number',
        defaultValue: 1,
      },
      myText: {
        type: 'text',
        label: 'My text',
        defaultValue: 'Hello world',
      },
    }
    const wrapper = shallow(<UserOptions options={options} />)
    expect(wrapper.find({ children: 'Number: 1' }).length).toBe(1)
    expect(wrapper.find({ children: 'My text: Hello world' }).length).toBe(1)
  })

  it('should render change button', () => {
    const wrapper = shallow(<UserOptions showChangeButton={true} />)
    expect(wrapper.find('Button[children="Change"]').length).toBe(1)
  })

  it('should not render change button', () => {
    const wrapper = shallow(<UserOptions />)
    expect(wrapper.find('Button[children="Change"]').length).toBe(0)
  })

  it('should display edit mode', () => {
    const options = {
      number: {
        type: 'number',
        label: 'Number',
        defaultValue: 1,
      },
    }
    const wrapper = shallow(<UserOptions options={options} showChangeButton={true} />)
    const change = wrapper.find('Button[children="Change"]')
    expect(wrapper.find('Button[children="Cancel"]').length).toBe(0)
    expect(wrapper.find('Button[children="Save"]').length).toBe(0)
    expect(wrapper.find('InputNumber[label="Number"]').length).toBe(0)
    change.simulate('press')
    wrapper.update()
    expect(wrapper.find('Button[children="Cancel"]').length).toBe(1)
    expect(wrapper.find('Button[children="Save"]').length).toBe(1)
    expect(wrapper.find('InputNumber[label="Number"]').length).toBe(1)
  })

  it('should cancel editing', () => {
    const options = {
      number: {
        type: 'number',
        label: 'Number',
        defaultValue: 1,
      },
    }
    const wrapper = shallow(<UserOptions options={options} showChangeButton={true} />)
    const change = wrapper.find('Button[children="Change"]')
    change.simulate('press')
    wrapper.update()
    const input = wrapper.find('InputNumber[label="Number"]')
    input.simulate('change', 3)
    const close = wrapper.find('Button[children="Cancel"]')
    close.simulate('press')
    wrapper.update()
    expect(wrapper.find('Button[children="Cancel"]').length).toBe(0)
    expect(wrapper.find('Button[children="Save"]').length).toBe(0)
    expect(wrapper.find('InputNumber[key="Number"]').length).toBe(0)
    expect(wrapper.find('Button[children="Change"]').length).toBe(1)
    expect(wrapper.find({ children: 'Number: 1' }).length).toBe(1)
  })

  it('should edit and trigger onChange event', () => {
    const options = {
      number: {
        type: 'number',
        label: 'Number',
        defaultValue: 1,
      },
    }
    const onChange = jest.fn()
    const wrapper = shallow(<UserOptions options={options} onChange={onChange} showChangeButton={true} />)
    const change = wrapper.find('Button[children="Change"]')
    change.simulate('press')
    wrapper.update()
    const input = wrapper.find('InputNumber[label="Number"]')
    input.simulate('change', 3)
    wrapper.update()
    const save = wrapper.find('Button[children="Save"]')
    save.simulate('press')
    wrapper.update()
    expect(wrapper.find({ children: 'Number: 1' }).length).toBe(0)
    expect(wrapper.find({ children: 'Number: 3' }).length).toBe(1)
    expect(onChange.mock.calls.length).toBe(1)
    expect(onChange.mock.calls[0][0]).toEqual({
      number: {
        type: 'number',
        label: 'Number',
        defaultValue: 1,
        value: 3,
      },
    })
  })

  it('should not pass via validation', () => {
    const options = {
      number: {
        type: 'number',
        label: 'Number',
        constraints: { min: 0 },
        defaultValue: 1,
      },
    }
    const onChange = jest.fn()
    const wrapper = shallow(<UserOptions options={options} onChange={onChange} showChangeButton={true} />)
    const change = wrapper.find('Button[children="Change"]')
    change.simulate('press')
    wrapper.update()
    const input = wrapper.find('InputNumber[label="Number"]')
    input.simulate('change', -3, 'some error')
    wrapper.update()
    const save = wrapper.find('Button[children="Save"]')
    save.simulate('press')
    wrapper.update()
    const inputWithError = wrapper.find('InputNumber[label="Number"]')
    expect(inputWithError.length).toBe(1)
    expect(!!inputWithError.prop('err')).toBe(true)
  })

})
