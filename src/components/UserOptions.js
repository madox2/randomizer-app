import React, { PropTypes, Component } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'

const mapObject = (obj, fn) => Object.keys(obj).map(k => fn([ k, obj[k] ]))

export const Button = ({ children, onPress }) => (
  <TouchableHighlight onPress={onPress}>
    <Text>{children}</Text>
  </TouchableHighlight>
)

export const InputText = ({ children  }) => (
  <Text>TBD</Text>
)

const inputs = {
  number: InputText,
  text: InputText,
}

const makeOptions = options => Object.keys(options).reduce((r, key) => {
  return Object.assign(
    r, {
      [key]: {
        ...options[key],
        value: options[key].defaultValue,
      },
    }
  )
}, {})

export class UserOptions extends Component {

  constructor(...props) {
    super(...props)
    this.change = this.change.bind(this)
    this.cancel = this.cancel.bind(this)
    this.save = this.save.bind(this)
    this.state = {
      editMode: false,
      options: makeOptions(this.props.options),
    }
  }

  render() {
    const { editMode } = this.state
    const summary = this.makeSummary()
    return (
      <View>
        {summary}
        <Button onPress={this.change}>Change</Button>
        {editMode && (
          <View>
            {this.makeInputs()}
            <Button onPress={this.cancel}>Cancel</Button>
            <Button onPress={this.save}>Save</Button>
          </View>
        )}
      </View>
    )
  }

  change() {
    this.setState({
      editMode: true,
      editOptions: this.state.options,
    })
  }

  cancel() {
    this.setState({
      editMode: false,
      editOptions: null,
    })
  }

  save() {
    this.props.onChange(this.state.editOptions)
    this.setState({
      editMode: false,
      editOptions: null,
      options: this.state.editOptions,
    })
  }

  onInputChange(key, value) {
    const { editOptions } = this.state
    this.setState({
      editOptions: {
        ...editOptions,
        [key]: { ...editOptions[key], value },
      },
    })
  }

  makeInputs() {
    return mapObject(this.state.options, ([ key, obj ]) => {
      const Input = inputs[obj.type]
      const onInputChange = this.onInputChange.bind(this, key)
      return (
        <Input
          key={key}
          value={obj.value}
          label={obj.label}
          onChange={onInputChange}
        />
      )
    })
  }

  makeSummary() {
    return mapObject(this.state.options, ([ key, obj ]) => {
      const text = `${obj.label}: ${obj.value}`
      return (
        <Text key={key}>{text}</Text>
      )
    })
  }

}

UserOptions.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func,
}

UserOptions.defaultProps = {
  options: {},
  onChange: () => 0,
}
