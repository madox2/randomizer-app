import React from 'react'
import { Navigator } from './components/Navigator'
import { LayoutListener } from './components/LayoutListener'
import { Welcome} from './screens'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'
import { MenuContext } from 'react-native-popup-menu'

ResponsiveStyleSheet.setExtension(({ width, height }) => {
  const dividerWidth = 4
  const size = Math.max(width, height)
  const minSize = Math.min(width, height)
  const controlsHeight = 100
  const contentPadding = minSize * 0.04
  const contentHeight = height - 2 * contentPadding
  const contentWidth = width - 2 * contentPadding
  const headingFontSize = size > 700 ? 28 : 18
  const settingsHeight = 22
  const controlButtonSize = 70
  return {
    dividerWidth,
    controlsHeight,
    contentHeight,
    contentWidth,
    contentPadding,
    headingFontSize,
    settingsHeight,
    controlButtonSize,
  }
})

export class App extends React.Component {

  render() {
    return (
      <LayoutListener onLayout={() => this.setState({})}>
        <MenuContext customStyles={popupMenuStyles}>
          <Navigator root={Welcome} />
        </MenuContext>
      </LayoutListener>
    )
  }

}

const popupMenuStyles = {
  backdrop: {
    backgroundColor: 'black',
    opacity: 0.5,
  },
}
