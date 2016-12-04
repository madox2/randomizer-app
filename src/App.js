import React from 'react'
import { Navigator } from './components/Navigator'
import { Welcome} from './screens'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

ResponsiveStyleSheet.setExtension(({ width, height }) => {
  const dividerWidth = 4
  const size = Math.max(width, height)
  const minSize = Math.min(width, height)
  const controlsSize = 100
  const contentPadding = minSize * 0.06
  const contentHeight = height - controlsSize - contentPadding
  const contentWidth = width - contentPadding
  const headingFontSize = size > 700 ? 28 : 18
  const settingsHeight = 22
  return {
    dividerWidth,
    controlsSize,
    contentHeight,
    contentWidth,
    contentPadding,
    headingFontSize,
    settingsHeight,
  }
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
