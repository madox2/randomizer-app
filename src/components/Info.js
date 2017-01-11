import React, { Component } from 'react'
import { Text, InteractionManager, TouchableOpacity } from 'react-native'
import { Menu, MenuTrigger, MenuOption, MenuOptions } from 'react-native-popup-menu'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'
import { InfoButton } from './InfoButton'

export class Info extends Component {

  constructor(...args) {
    super(...args)
    this.dismiss = this.dismiss.bind(this)
    this.openMenu = this.openMenu.bind(this)
  }

  componentDidMount() {
    /*
    InteractionManager.runAfterInteractions(() => {
      this.context.menuActions.openMenu('info')
    })
    */
  }

  openMenu() {
    this.context.menuActions.openMenu('info')
  }

  dismiss() {
    this.context.menuActions.closeMenu()
  }

  render() {
    const { text, buttonColor } = this.props
    const s = makeStyles()
    return(
      <Menu name='info'>
        <MenuTrigger>
          <InfoButton onPress={this.openMenu} type='info' backgroundColor={buttonColor} />
        </MenuTrigger>
        <MenuOptions customStyles={{optionsContainer: s.options}}>
          <MenuOption style={s.option}>
            <Text style={s.text}>{text}</Text>
            <TouchableOpacity onPress={this.dismiss}>
              <Text style={s.dismiss}>dismiss...</Text>
            </TouchableOpacity>
          </MenuOption>
        </MenuOptions>
      </Menu>
    )
  }

}

Info.contextTypes = {
  menuActions: React.PropTypes.object,
}

const makeStyles = ResponsiveStyleSheet.create(() => ({
  options: {
    borderRadius: 20,
    borderTopRightRadius: 0,
  },
  option: {
    padding: 13,
    paddingTop: 18,
  },
  text: {
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
  },
  dismiss: {
    marginTop: 20,
    lineHeight: 24,
    fontSize: 16,
    textAlign: 'right',
    color: '#6495ed',
  },
}))
