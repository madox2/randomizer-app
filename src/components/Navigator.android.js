import React, { Component, PropTypes } from 'react'
import { Navigator as NativeNavigator } from 'react-native'

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
