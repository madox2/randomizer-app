import React, {ReactNode, useEffect, useRef, useState} from 'react'
import {Animated, Platform, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native'
import {CONTROL_FILL, fonts, ON_COLOR, ON_COLOR_SOFT} from '../theme/colors'
import {Metrics, useMetrics} from '../theme/metrics'
import {useReduceMotion} from '../utils/motion'
import {UiIcon} from './art/icons'
import {ICON_BUTTON_SIZE, IconButton} from './IconButton'
import {Options, OptionsSheet, optionsSummary} from './OptionsSheet'
import {Touchable} from './Touchable'

export type SectionProps = {
  title: string
  color: string
  hint: string
  onBack: () => void
}

type Props = Partial<SectionProps> & {
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  /** a control displayed above the hint, e.g. a stepper */
  footer?: ReactNode
  onRefresh?: () => void
  onSettings?: () => void
  options?: Options
  onOptionsChange?: (values: Record<string, number>) => void
}

/**
 * Common layout of all sections: colored background, top bar (back, summary
 * of the options which opens the settings), content and bottom bar
 * (footer and hint).
 */
export const SectionTemplate = ({
  children,
  style,
  footer,
  title = '',
  color = '#444',
  hint,
  onBack,
  onRefresh,
  onSettings,
  options,
  onOptionsChange,
}: Props) => {
  const m = useMetrics()
  const s = makeStyles(m)
  const [editing, setEditing] = useState(false)
  const reduceMotion = useReduceMotion()
  const appear = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: reduceMotion ? 0 : 240,
      useNativeDriver: Platform.OS !== 'web',
    }).start()
  }, [appear, reduceMotion])

  const openSettings = () => {
    onSettings?.()
    setEditing(true)
  }

  return (
    <View style={[s.container, {backgroundColor: color}]}>
      <Animated.View style={[s.safeArea, {opacity: appear}]}>
        <View style={s.topBar}>
          {onBack ? (
            <IconButton icon="back" label="Back" onPress={onBack} />
          ) : (
            <View />
          )}
          <View style={s.summaryContainer}>
            {options && (
              <Touchable
                onPress={openSettings}
                accessibilityLabel={`Settings: ${optionsSummary(options)}`}
                style={s.summary}>
                <Text style={s.summaryText} numberOfLines={1}>
                  {optionsSummary(options)}
                </Text>
                <UiIcon name="settings" size={18} />
              </Touchable>
            )}
          </View>
          {/* keeps the summary centered */}
          <View style={s.topBarSpacer} />
        </View>
        <View style={[s.content, style]}>{children}</View>
        <View style={s.bottomBar}>
          {onRefresh && (
            <Touchable onPress={onRefresh} accessibilityLabel="New game" style={s.refresh}>
              <UiIcon name="refresh" size={20} />
              <Text style={s.refreshText}>New game</Text>
            </Touchable>
          )}
          {footer}
          {!!hint && <Text style={s.hint}>{hint}</Text>}
        </View>
      </Animated.View>
      {options && (
        <OptionsSheet
          visible={editing}
          title={title}
          accent={color}
          options={options}
          onClose={() => setEditing(false)}
          onSave={(values) => {
            onOptionsChange?.(values)
            setEditing(false)
          }}
        />
      )}
    </View>
  )
}

const makeStyles = ({insets, contentPadding, topBarHeight, bottomBarHeight}: Metrics) =>
  StyleSheet.create({
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
    topBar: {
      height: topBarHeight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: contentPadding,
    },
    topBarSpacer: {
      width: ICON_BUTTON_SIZE,
    },
    summaryContainer: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    summary: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 40,
      maxWidth: '100%',
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: CONTROL_FILL,
    },
    summaryText: {
      flexShrink: 1,
      marginRight: 8,
      color: ON_COLOR,
      fontSize: fonts.size.caption + 1,
      fontWeight: fonts.bold,
    },
    content: {
      flex: 1,
    },
    bottomBar: {
      height: bottomBarHeight,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: contentPadding,
    },
    hint: {
      color: ON_COLOR_SOFT,
      fontSize: fonts.size.body - 1,
      marginTop: 8,
      textAlign: 'center',
    },
    refresh: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 44,
      paddingHorizontal: 18,
      borderRadius: 22,
      backgroundColor: CONTROL_FILL,
    },
    refreshText: {
      marginLeft: 8,
      color: ON_COLOR,
      fontSize: fonts.size.body,
      fontWeight: fonts.bold,
    },
  })
