import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {BackHandler} from 'react-native'

export class Navigator extends Component {
  constructor(...args) {
    super(...args)
    this.history = [this.props.root]
    this.state = {Screen: this.props.root}
  }

  navigate(Screen) {
    this.history.push(Screen)
    this.setState({Screen})
  }

  back() {
    this.history.length > 1 && this.history.pop()
    this.setState({Screen: this.history[this.history.length - 1]})
  }

  getChildContext() {
    return {
      navigate: this.navigate.bind(this),
      back: this.back.bind(this),
    }
  }

  render() {
    const {Screen} = this.state
    return <Screen />
  }

  _backListener = () => {
    if (this.history.length > 1) {
      this.back()
      return true
    }
    return false
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backListener)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backListener)
  }
}

Navigator.propTypes = {
  root: PropTypes.func.isRequired,
}

Navigator.childContextTypes = {
  navigate: PropTypes.func,
  back: PropTypes.func,
}
