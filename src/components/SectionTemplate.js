import React, { Component, PropTypes } from 'react'
import { View } from 'react-native'
import { UserOptions } from './UserOptions'
import { ControlButton } from './ControlButton'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

export class SectionTemplate extends Component {

  constructor(...args) {
    super(...args)
    this.back = this.back.bind(this)
    this.onSettings = this.onSettings.bind(this)
  }

  render() {
    const {
      children,
      onRefresh,
      options,
      onOptionsChange,
      style,
      color,
    } = this.props
    const displayBack = this.props.onBack || this.context.back
    const s = makeStyles()
    return (
      <View style={[s.container, { backgroundColor: color }]}>
        {options &&
          <View style={s.options}>
            <UserOptions
              ref={r => this.options = r}
              options={options}
              onChange={onOptionsChange}
            />
          </View>
        }
        <View style={[s.content, style]}>
          {children}
        </View>
        <View style={s.controls}>
          <View style={s.controlButtonContainerLeft}>
            {displayBack && <ControlButton onPress={this.back} type='back' />}
          </View>
          <View style={s.controlButtonContainerCenter}>
            {onRefresh && <ControlButton onPress={onRefresh} type='refresh' />}
          </View>
          <View style={s.controlButtonContainerRight}>
            {options && <ControlButton onPress={this.onSettings} type='settings' />}
          </View>
        </View>
      </View>
    )
  }

  onSettings() {
    this.options.change()
  }

  back() {
    this.context.back && this.context.back()
    this.props.onBack && this.props.onBack()
  }

}

SectionTemplate.propTypes = {
  onBack: PropTypes.func,
  onRefresh: PropTypes.func,
  options: PropTypes.object,
  onOptionsChange: PropTypes.func,
  title: PropTypes.string,
  color: PropTypes.string,
}

SectionTemplate.contextTypes = {
  back: PropTypes.func,
}

const makeStyles = ResponsiveStyleSheet.create(({ width, controlsSize }) => {
  const controlsButtonContainer = {
    width: width / 3,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  }
  return ({
    container: {
      flex: 1,
    },
    controls: {
      height: controlsSize,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    controlButtonContainerLeft: {
      ...controlsButtonContainer,
      alignItems: 'flex-start',
    },
    controlButtonContainerCenter: {
      ...controlsButtonContainer,
      alignItems: 'center',
    },
    controlButtonContainerRight: {
      ...controlsButtonContainer,
      alignItems: 'flex-end',
    },
    content: {
      flex: 1,
    },
    options: {
    },
  })
})
