import React, { PropTypes, Component } from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import { InputNumber } from './InputNumber'
import { mapProps, reduceProps, someProp } from '../utils/functional'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

export const Button = ({ children, onPress }) => (
  <TouchableHighlight onPress={onPress} style={staticStyles.button}>
    <Text>{children}</Text>
  </TouchableHighlight>
)

const inputs = {
  number: InputNumber,
}

export class UserOptions extends Component {

  constructor(...props) {
    super(...props)
    this.change = this.change.bind(this)
    this.cancel = this.cancel.bind(this)
    this.save = this.save.bind(this)
    const options = reduceProps(this.props.options, obj => ({
      ...obj, value: obj.defaultValue,
    }))
    this.state = { editMode: false, options }
  }

  render() {
    const { editMode } = this.state
    const s = makeStyles()
    return editMode ? (
      <View style={[s.container, s.editContainer]}>
        <View style={s.edit}>
          {this.makeInputs()}
        </View>
        <View style={s.controls}>
          <Button onPress={this.cancel}>Cancel</Button>
          <Button onPress={this.save}>Save</Button>
        </View>
      </View>
    ) : (
      <View style={s.container}>
        <View style={s.summary}>
          {this.makeSummary(s)}
        </View>
        {this.props.showChangeButton &&
          <View style={s.controls}>
            <Button onPress={this.change}>Change</Button>
          </View>
        }
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
    const { editOptions } = this.state
    const hasErrors = someProp(editOptions, p => p.err)
    if (hasErrors) {
      this.setState({ editOptions })
      return
    }
    this.props.onChange(editOptions)
    this.setState({
      editMode: false,
      editOptions: null,
      options: editOptions,
    })
  }

  onInputChange(key, value, err) {
    const { editOptions } = this.state
    this.setState({
      editOptions: {
        ...editOptions,
        [key]: { ...editOptions[key], value, err },
      },
    })
  }

  makeInputs() {
    const { editOptions } = this.state
    return mapProps(editOptions, ([ key, obj ]) => {
      const Input = inputs[obj.type]
      const onInputChange = this.onInputChange.bind(this, key)
      return (
        <Input
          key={key}
          value={obj.value}
          label={obj.label}
          constraints={obj.constraints}
          err={obj.err}
          onChange={onInputChange}
        />
      )
    })
  }

  makeSummary(s) {
    return mapProps(this.state.options, ([ key, obj ]) => {
      const text = `${obj.label}: ${obj.value}`
      return (
        <Text style={s.summaryItem} key={key}>{text}</Text>
      )
    })
  }

}

UserOptions.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func,
  showChangeButton: PropTypes.bool,
}

UserOptions.defaultProps = {
  options: {},
  onChange: () => 0,
  showChangeButton: false,
}

const makeStyles = ResponsiveStyleSheet.create(({ settingsHeight }) => ({
  container: {
    padding: 5,
  },
  editContainer: {
    backgroundColor: '#DDD',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
  summary: {
    flexDirection: 'row',
    height: settingsHeight,
  },
  summaryItem: {
    marginRight: 15,
  },
  edit: {
    flexDirection: 'column',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
}))

const staticStyles = StyleSheet.create({
  buttion: {
    padding: 5,
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: '#999',
  },
})
