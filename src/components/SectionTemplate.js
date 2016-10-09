import React, { Component, PropTypes } from 'react'
import { View, TouchableHighlight, Text } from 'react-native'

export const Button = props => (
  <TouchableHighlight onPress={props.onPress}>
    <Text>{props.children}</Text>
  </TouchableHighlight>
)

export class SectionTemplate extends Component {

  render() {
    const { children, reset, fire } = this.props
    const back = this.props.back || this.context.back
    return (
      <View>
        {children}
        {back &&
          <Button onPress={back}>Back</Button>
        }
        {fire &&
          <Button onPress={fire}>Fire</Button>
        }
        {reset &&
          <Button onPress={reset}>Reset</Button>
        }
      </View>
    )
  }

}

SectionTemplate.propTypes = {
  back: PropTypes.func,
}

SectionTemplate.contextTypes = {
  back: PropTypes.func,
}
