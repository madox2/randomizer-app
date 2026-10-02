import React, {Ref, useEffect, useImperativeHandle, useRef, useState} from 'react'
import {
  Animated,
  BackHandler,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {Metrics, useMetrics} from '../theme/metrics'
import {mapProps, reduceProps, someProp} from '../utils/functional'
import {NumberConstraints} from '../utils/validate'
import {Button} from './Button'
import {InputNumber} from './InputNumber'

export type NumberOption = {
  type: 'number'
  label: string
  defaultValue: number
  constraints?: NumberConstraints
  /** Validation of the option in the context of all options. */
  validator?: (options: Options) => string | null
  value?: number | string
  err?: string | null
  customErr?: string | null
}

export type Options = Record<string, NumberOption>

export type UserOptionsHandle = {change: () => void}

type Props = {
  options: Options
  onChange: (options: Options) => void
  ref?: Ref<UserOptionsHandle>
}

const withDefaultValues = (options: Options): Options =>
  reduceProps(options, (option) => ({...option, value: option.defaultValue}))

/**
 * Summary of the current options displayed in the corner of the screen
 * and the form (overlaying the screen) to change them.
 */
export const UserOptions = ({options: defaults, onChange, ref}: Props) => {
  const m = useMetrics()
  const s = makeStyles(m)
  const [options, setOptions] = useState<Options>(() =>
    withDefaultValues(defaults),
  )
  const [editOptions, setEditOptions] = useState<Options | null>(null)

  useImperativeHandle(ref, () => ({change: () => setEditOptions(options)}), [
    options,
  ])

  const cancel = () => setEditOptions(null)

  const save = () => {
    if (!editOptions) {
      return
    }
    const validated = reduceProps(editOptions, (option) => {
      const customErr = option.validator ? option.validator(editOptions) : null
      const err = option.customErr ? customErr : option.err || customErr
      return {...option, err, customErr}
    })
    if (someProp(validated, (option) => option.err)) {
      setEditOptions(validated)
      return
    }
    onChange(editOptions)
    setOptions(editOptions)
    setEditOptions(null)
  }

  const onInputChange = (
    key: string,
    value: number | string,
    err: string | null,
  ) =>
    setEditOptions((current) =>
      current
        ? {...current, [key]: {...current[key], value, err, customErr: null}}
        : current,
    )

  return (
    <>
      <View style={s.summaryContainer} pointerEvents="none">
        <View style={s.summary}>
          {mapProps(options, ([key, option]) => (
            <Text style={s.summaryItem} key={key}>
              {`${option.label}: ${option.value}`}
            </Text>
          ))}
        </View>
      </View>
      {editOptions && (
        <OptionsEditor onCancel={cancel} onSave={save}>
          {mapProps(editOptions, ([key, option]) => (
            <InputNumber
              key={key}
              value={option.value as number | string}
              label={option.label}
              constraints={option.constraints}
              err={option.err}
              onChange={(value, err) => onInputChange(key, value, err)}
              onSubmitEditing={save}
            />
          ))}
        </OptionsEditor>
      )}
    </>
  )
}

type EditorProps = {
  children: React.ReactNode
  onSave: () => void
  onCancel: () => void
}

const OptionsEditor = ({children, onSave, onCancel}: EditorProps) => {
  const m = useMetrics()
  const s = makeStyles(m)
  const slide = useRef(new Animated.Value(Platform.OS === 'web' ? 0 : 1)).current

  useEffect(() => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start()
  }, [slide])

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onCancel()
      return true
    })
    return () => subscription.remove()
  }, [onCancel])

  return (
    <Animated.View
      style={[
        s.editor,
        {transform: [{translateY: Animated.multiply(slide, m.height)}]},
      ]}>
      <KeyboardAvoidingView
        style={s.editContainer}
        behavior={Platform.OS === 'web' ? undefined : 'padding'}>
        <View style={s.edit}>{children}</View>
        <View style={s.controls}>
          <Button onPress={onSave} style={s.buttonLeft}>
            Save
          </Button>
          <Button onPress={onCancel}>Cancel</Button>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  )
}

const makeStyles = ({insets, settingsHeight}: Metrics) =>
  StyleSheet.create({
    summaryContainer: {
      position: 'absolute',
      top: insets.top,
      left: insets.left,
      padding: 5,
    },
    summary: {
      flexDirection: 'row',
      height: settingsHeight,
    },
    summaryItem: {
      marginRight: 15,
      color: '#444',
      fontStyle: 'italic',
    },
    editor: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'white',
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    editContainer: {
      flex: 1,
      padding: 5,
    },
    edit: {
      flexDirection: 'column',
      flex: 1,
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    buttonLeft: {
      borderRightWidth: 0,
    },
  })
