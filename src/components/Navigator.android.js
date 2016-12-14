import React, { Component, PropTypes } from 'react'
import { Navigator as NativeNavigator, BackAndroid } from 'react-native'

// TODO: NativeNavigator.SceneConfigs.PushFromRight has bug when orientation changes:
// https://productpains.com/post/react-native/navigator-width-is-not-updated-when-orientation-is-changed-so-switch-animation-stops-halfway-and-component-vanishes

export class Navigator extends Component {

  constructor(...args) {
    super(...args)
    this.state = { Initial: this.props.root }
    this._onRef = this._onRef.bind(this)
    this._backPressListener = this._backPressListener.bind(this)
  }

  navigate(Scene) {
    this._navigator.push({ Scene })
  }

  back() {
    this._navigator.pop()
  }

  getChildContext() {
    return {
      navigate: this.navigate.bind(this),
      back: this.back.bind(this),
    }
  }

  _onRef(navigator) {
    this._navigator = navigator
  }

  _backPressListener() {
    if (this._navigator && this._navigator.getCurrentRoutes().length > 1) {
      this._navigator.pop()
      return true
    }
    return false
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._backPressListener)
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._backPressListener)
  }

  render() {
    const { Initial } = this.state
    return (
      <NativeNavigator
        ref={this._onRef}
        initialRoute={{Scene: Initial}}
        renderScene={({ Scene }) => <Scene />}
        configureScene={() => NativeNavigator.SceneConfigs.PushFromRight}
      />
    )
  }

}

Navigator.propTypes = {
  root: PropTypes.func.isRequired,
}

Navigator.childContextTypes = {
  navigate: PropTypes.func,
  back: PropTypes.func,
}
