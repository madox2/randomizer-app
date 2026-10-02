import React, {ReactNode, useRef} from 'react'
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native'
import {Metrics, useMetrics} from '../theme/metrics'
import {ControlButton} from './ControlButton'
import {InfoPopup, useInfoPopup} from './Info'
import {InfoButton} from './InfoButton'
import {Options, UserOptions, UserOptionsHandle} from './UserOptions'

export type SectionProps = {
  color: string
  buttonColor: string
  type: string
  onBack: () => void
}

type Props = Partial<SectionProps> & {
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  onRefresh?: () => void
  onSettings?: () => void
  options?: Options
  onOptionsChange?: (options: Options) => void
}

/**
 * Common layout of all sections: colored background, content, control buttons,
 * summary of the user options and the info button.
 */
export const SectionTemplate = ({
  children,
  style,
  color,
  buttonColor,
  type = '',
  onBack,
  onRefresh,
  onSettings,
  options,
  onOptionsChange,
}: Props) => {
  const m = useMetrics()
  const s = makeStyles(m)
  const optionsRef = useRef<UserOptionsHandle>(null)
  const info = useInfoPopup(type)

  const openSettings = () => {
    optionsRef.current?.change()
    onSettings?.()
  }

  return (
    <View style={[s.container, {backgroundColor: color}]}>
      <View style={s.safeArea}>
        <View style={[s.content, style]}>{children}</View>
        <View style={s.controlButtonContainerLeft}>
          {onBack && (
            <ControlButton
              onPress={onBack}
              type="back"
              backgroundColor={buttonColor}
            />
          )}
        </View>
        <View style={s.controlButtonContainerCenter}>
          {onRefresh && (
            <ControlButton
              onPress={onRefresh}
              type="refresh"
              backgroundColor={buttonColor}
            />
          )}
        </View>
        <View style={s.controlButtonContainerRight}>
          {options && (
            <ControlButton
              onPress={openSettings}
              type="settings"
              backgroundColor={buttonColor}
            />
          )}
        </View>
        <View style={s.infoContainer}>
          <InfoButton
            onPress={info.show}
            type="help"
            backgroundColor={buttonColor}
          />
        </View>
      </View>
      {options && (
        <UserOptions
          ref={optionsRef}
          options={options}
          onChange={onOptionsChange ?? (() => undefined)}
        />
      )}
      {info.visible && <InfoPopup type={type} onDismiss={info.hide} />}
    </View>
  )
}

const makeStyles = ({
  width,
  insets,
  contentPadding,
  controlButtonSize,
}: Metrics) => {
  const controlsButtonContainer = {
    justifyContent: 'center',
    position: 'absolute',
    bottom: contentPadding,
  } as const
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    // area which is not covered by the system bars
    safeArea: {
      flex: 1,
      marginTop: insets.top,
      marginBottom: insets.bottom,
      marginLeft: insets.left,
      marginRight: insets.right,
    },
    controlButtonContainerLeft: {
      ...controlsButtonContainer,
      left: contentPadding,
    },
    controlButtonContainerCenter: {
      ...controlsButtonContainer,
      left: width / 2 - controlButtonSize / 2,
    },
    controlButtonContainerRight: {
      ...controlsButtonContainer,
      left: width - contentPadding - controlButtonSize,
    },
    content: {
      flex: 1,
    },
    infoContainer: {
      position: 'absolute',
      padding: contentPadding / 2,
      top: 0,
      right: 0,
    },
  })
}
