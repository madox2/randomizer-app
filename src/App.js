import React from 'react'
import { Navigator } from './components/Navigator'
import { Welcome} from './screens'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

ResponsiveStyleSheet.setExtension(({ width, height }) => {
  const dividerWidth = 4
  const length = Math.max(width, height)
  const controlsSize = 100
  const contentSize = length - controlsSize
  return { dividerWidth, controlsSize, contentSize }
})

export class App extends React.Component {

  constructor(...args) {
    super(...args)
    // TODO: reimplement with onLayout
    // temporary refresh when window is resized
    window && window.addEventListener('resize', () => this.setState({}), true)
  }

  render() {
    return (
      <Navigator root={Welcome} />
    )
  }

}
