import React, { Component } from 'react'
import Navigator from './Navigator'
import { Welcome} from './screens'

export class App extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      Screen: () => null,
    }
  }

  componentDidMount() {
    Navigator.addListener(this.onNavigate.bind(this))
    Navigator.navigate(Welcome)
  }

  onNavigate(Screen) {
    this.setState({ Screen })
  }

  render() {
    const { Screen } = this.state
    return (
      <Screen />
    )
  }

}
