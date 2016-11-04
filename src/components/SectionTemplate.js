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
    } = this.props
    const displayBack = this.props.onBack || this.context.back
    const s = makeStyles()
    return (
      <View style={s.container}>
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
          <View style={s.controlButtonContainer}>
            {displayBack && <ControlButton onPress={this.back} type='back' />}
          </View>
          <View style={s.controlButtonContainer}>
            {onRefresh && <ControlButton onPress={onRefresh} type='refresh' />}
          </View>
          <View style={s.controlButtonContainer}>
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
}

SectionTemplate.contextTypes = {
  back: PropTypes.func,
}

const makeStyles = ResponsiveStyleSheet.create(({ width }) => ({
  container: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  controlButtonContainer: {
    width: width / 3,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  options: {
  },
}))
