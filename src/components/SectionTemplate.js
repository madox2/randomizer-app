import React, { Component, PropTypes } from 'react'
import { StyleSheet, View, TouchableHighlight, Text } from 'react-native'
import { UserOptions } from './UserOptions'

export const Button = props => (
  <TouchableHighlight onPress={props.onPress} style={s.button}>
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
      style,
    } = this.props
    const displayBack = this.props.onBack || this.context.back
    return (
      <View style={s.container}>
        <View style={s.header}>
          <Text>{title}</Text>
        </View>
        {options &&
          <View style={s.options}>
            <UserOptions options={options} onChange={onOptionsChange} />
          </View>
        }
        <View style={[s.content, style]}>
          {children}
        </View>
        <View style={s.controls}>
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

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#79C753',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#79C753',
  },
  content: {
    flex: 1,
  },
  button: {
    padding: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  options: {
    backgroundColor: '#B565A7',
  },
})
