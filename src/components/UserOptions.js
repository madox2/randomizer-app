import React, { PropTypes, Component } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'

const mapObject = (obj, fn) => Object.keys(obj).map(k => fn([ k, obj[k] ]))


export class UserOptions extends Component {

  constructor(...props) {
    super(...props)
  }

  render() {
    const { options } = this.props
    const summary = mapObject(options, ([ key, value ]) => {
      const text = `${value.name}: ${value.defaultValue}`
      return (
        <Text key={key}>{text}</Text>
      )
    })
    return (
      <View>
        {summary}
        <Button>Change</Button>
      </View>
    )
  }

}

export const Button = ({ children, onPress }) => (
  <TouchableHighlight onPress={onPress}>
    <Text>{children}</Text>
  </TouchableHighlight>
)

UserOptions.propTypes = {
  options: PropTypes.object,
}

UserOptions.defaultProps = {
  options: {},
}
