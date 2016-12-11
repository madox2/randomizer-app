import React, { Component, PropTypes } from 'react'
import { Navigator as NativeNavigator } from 'react-native'

// TODO: NativeNavigator.SceneConfigs.PushFromRight looks better but it has bug when orientation changes:
// https://productpains.com/post/react-native/navigator-width-is-not-updated-when-orientation-is-changed-so-switch-animation-stops-halfway-and-component-vanishes

export class Navigator extends Component {

  constructor(...args) {
    super(...args)
    this.state = { Initial: this.props.root }
    this._onRef = this._onRef.bind(this)
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

  render() {
    const { Initial } = this.state
    return (
      <NativeNavigator
        ref={this._onRef}
        initialRoute={{Scene: Initial}}
        renderScene={({ Scene }) => <Scene />}
        configureScene={() => NativeNavigator.SceneConfigs.FadeAndroid}
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
