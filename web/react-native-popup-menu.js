import React, { Component, PropTypes } from 'react'
import { View } from 'react-native'

/**
 * Simple replacement for react-native-popup-menu in web.
 * It is not reusable since it works only with Info.js component.
 */

let lastMenuOptions = <div></div>

export const Menu = View
export const MenuOptions = props => {
  lastMenuOptions = props.children
  return (
    <View></View>
  )
}
export const MenuOption = View
export const MenuTrigger = View

export class MenuContext extends Component {
  getChildContext() {
    return {
      menuActions: {
        openMenu: () => {
          // text from menu options in Info component
          const infoText = lastMenuOptions.props.children[0].props.children
          alert(infoText)
        },
        closeMenu: () => 0,
      },
    }
  }
  render() {
    return (
      <View style={{flex: 1}}>{this.props.children}</View>
    )
  }
}

MenuContext.childContextTypes = {
  menuActions: PropTypes.object,
}
