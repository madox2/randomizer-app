import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Platform, KeyboardAvoidingView as KAW, View, Text} from 'react-native'
import {InputNumber} from './InputNumber'
import {mapProps, reduceProps, someProp} from '../utils/functional'
import {ResponsiveStyleSheet} from 'react-native-responsive-stylesheet'
import {Modal} from '../components/Modal'
import {Button} from '../components/Button'

// TODO: should be added to react-native-web
const KeyboardAvoidingView = Platform.OS === 'web' ? View : KAW

const inputs = {
  number: InputNumber,
}

// FIXME:
// https://github.com/facebook/react-native/issues/10795
// https://github.com/facebook/react-native/issues/10845
const timeout = (task, ms) => () => setTimeout(task, ms)

export class UserOptions extends Component {
  constructor(...props) {
    super(...props)
    this.change = this.change.bind(this)
    this.cancel = this.cancel.bind(this)
    this.save = this.save.bind(this)
    const options = reduceProps(this.props.options, (obj) => ({
      ...obj,
      value: obj.defaultValue,
    }))
    this.state = {editMode: false, options}
  }

  render() {
    const {editMode} = this.state
    const s = makeStyles()
    return editMode ? (
      <Modal onRequestClose={this.cancel}>
        <KeyboardAvoidingView style={[s.container, s.editContainer]}>
          <View style={s.edit}>{this.makeInputs()}</View>
          <View style={s.controls}>
            <Button onPress={this.save} style={s.buttonLeft}>
              Save
            </Button>
            <Button onPress={this.cancel}>Cancel</Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    ) : (
      <View style={s.container}>
        <View style={s.summary}>{this.makeSummary(s)}</View>
        {this.props.showChangeButton && (
          <View style={s.controls}>
            <Button onPress={this.change}>Change</Button>
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
    const {editOptions} = this.state
    const validatedEditOptions = reduceProps(editOptions, (obj) => {
      let customErr = obj.validator ? obj.validator(editOptions) : null
      let err = obj.customErr ? customErr : obj.err || customErr
      return {...obj, err, customErr}
    })
    const hasErrors = someProp(validatedEditOptions, (p) => p.err)
    if (hasErrors) {
      this.setState({editOptions: validatedEditOptions})
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
    const {editOptions} = this.state
    this.setState({
      editOptions: {
        ...editOptions,
        [key]: {...editOptions[key], value, err, customErr: null},
      },
    })
  }

  makeInputs() {
    const {editOptions} = this.state
    return mapProps(editOptions, ([key, obj]) => {
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
          onSubmitEditing={timeout(this.save, 300)}
        />
      )
    })
  }

  makeSummary(s) {
    return mapProps(this.state.options, ([key, obj]) => {
      const text = `${obj.label}: ${obj.value}`
      return (
        <Text style={s.summaryItem} key={key}>
          {text}
        </Text>
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

const makeStyles = ResponsiveStyleSheet.create(({settingsHeight}) => ({
  container: {
    padding: 5,
  },
  editContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  summary: {
    flexDirection: 'row',
    height: settingsHeight,
  },
  summaryItem: {
    marginRight: 15,
    color: '#444',
    fontStyle: 'italic',
  },
  edit: {
    flexDirection: 'column',
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonLeft: {
    borderRightWidth: 0,
  },
}))
