import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {fonts, ON_COLOR} from '../theme/colors'
import {Metrics, useMetrics} from '../theme/metrics'
import {Glyph, GlyphName} from './art/icons'
import {Touchable} from './Touchable'

type Props = {
  title: string
  onPress: (viewRef: View | null) => void
  color: string
  type: GlyphName
}

/** Tile of a section on the home screen. */
export const SectionButton = ({title, onPress, color, type}: Props) => {
  const m = useMetrics()
  const s = makeStyles(m)
  const ref = React.useRef<View>(null)
  const glyphSize = Math.min(96, Math.max(48, (m.height / 3 - 2 * m.gap) * 0.45))
  return (
    <Touchable
      viewRef={ref}
      outerStyle={s.outer}
      pressedScale={0.97}
      accessibilityLabel={title}
      onPress={() => onPress(ref.current)}
      style={[s.container, {backgroundColor: color}]}>
      <View style={s.glyph}>
        <Glyph name={type} size={glyphSize} cutout={color} />
      </View>
      <Text style={s.text} numberOfLines={1}>
        {title}
      </Text>
    </Touchable>
  )
}

const makeStyles = ({landscape, height}: Metrics) =>
  StyleSheet.create({
    outer: {
      flex: 1,
    },
    container: {
      flex: 1,
      borderRadius: 24,
      padding: landscape && height < 500 ? 12 : 16,
    },
    glyph: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: ON_COLOR,
      fontSize: fonts.size.title,
      fontWeight: fonts.bold,
    },
  })
