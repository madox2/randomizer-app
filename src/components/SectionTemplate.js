import React, { Component, PropTypes } from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import { UserOptions } from './UserOptions'

export const Button = props => (
  <TouchableHighlight onPress={props.onPress}>
    <Text>{props.children}</Text>
  </TouchableHighlight>
)

export class SectionTemplate extends Component {

  constructor(...args) {
    super(...args)
    this.back = this.back.bind(this)
  }

  render() {
    const {
      children,
      title,
      onReset,
      onFire,
      options,
      onOptionsChange,
    } = this.props
    const displayBack = this.props.onBack || this.context.back
    return (
      <View>
        <Text>{title}</Text>
        {options &&
          <UserOptions options={options} onChange={onOptionsChange} />
        }
        {children}
        {displayBack &&
          <Button onPress={this.back}>Back</Button>
        }
        {onFire &&
          <Button onPress={onFire}>Fire</Button>
        }
        {onReset &&
          <Button onPress={onReset}>Reset</Button>
        }
      </View>
    )
  }

  back() {
    this.context.back && this.context.back()
    this.props.onBack && this.props.onBack()
  }

}

SectionTemplate.propTypes = {
  onBack: PropTypes.func,
  onFire: PropTypes.func,
  onReset: PropTypes.func,
  options: PropTypes.object,
  onOptionsChange: PropTypes.func,
  title: PropTypes.string,
}

SectionTemplate.contextTypes = {
  back: PropTypes.func,
}
