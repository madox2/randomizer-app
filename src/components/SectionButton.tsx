import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {fonts, ON_COLOR} from '../theme/colors'
import {Metrics, useMetrics} from '../theme/metrics'
import {sections} from '../screens/sections'
import {Glyph, GlyphName} from './art/icons'
import {Touchable} from './Touchable'

type Props = {
  title: string
  onPress: (viewRef: View | null) => void
  color: string
  type: GlyphName
}

// number of rows of the tiles on the home screen
const ROWS = Math.ceil(sections.length / 2)

const tilePadding = ({landscape, height}: Metrics) => (landscape && height < 500 ? 12 : 16)

const computeGlyphSize = (m: Metrics) => {
  if (m.landscape) {
    // the glyph is next to the title, so it is limited by the height of the tile
    const tileHeight = (m.height - m.gap * (ROWS + 1)) / ROWS
    return Math.max(32, Math.min(80, tileHeight - 2 * tilePadding(m)))
  }
  return Math.min(96, Math.max(48, (m.height / ROWS - 2 * m.gap) * 0.45))
}

/** Tile of a section on the home screen. */
export const SectionButton = ({title, onPress, color, type}: Props) => {
  const m = useMetrics()
  const s = makeStyles(m)
  const ref = React.useRef<View>(null)
  const glyphSize = computeGlyphSize(m)
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

const makeStyles = (m: Metrics) =>
  StyleSheet.create({
    outer: {
      flex: 1,
    },
    container: {
      flex: 1,
      borderRadius: 24,
      padding: tilePadding(m),
      // the glyph is above the title, in landscape next to it
      flexDirection: m.landscape ? 'row' : 'column',
      alignItems: m.landscape ? 'center' : 'stretch',
    },
    glyph: m.landscape
      ? {marginRight: 16}
      : {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
    text: {
      flexShrink: 1,
      color: ON_COLOR,
      fontSize: fonts.size.title,
      fontWeight: fonts.bold,
    },
  })
