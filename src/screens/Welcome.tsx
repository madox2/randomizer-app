import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {SectionButton} from '../components/SectionButton'
import {Metrics, useMetrics} from '../theme/metrics'
import {palette} from '../theme/palette'
import {SectionId, sections} from './sections'

type Props = {
  onSelect: (id: SectionId) => void
}

export const Welcome = ({onSelect}: Props) => {
  const m = useMetrics()
  const s = makeStyles(m)
  // sections are displayed in two columns
  const rows = [sections.slice(0, 2), sections.slice(2, 4), sections.slice(4, 6)]
  return (
    <View style={s.container}>
      <View style={s.safeArea}>
        <Text style={s.title}>Randomizer</Text>
        <View style={s.grid}>
          {rows.map((row, i) => (
            <View key={i} style={s.row}>
              {row.map(({id, title, color, type}) => (
                <SectionButton
                  key={id}
                  title={title}
                  color={color}
                  type={type}
                  onPress={() => onSelect(id)}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const makeStyles = ({dividerWidth, insets, contentPadding, height}: Metrics) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    safeArea: {
      flex: 1,
      marginTop: insets.top,
      marginBottom: insets.bottom,
      marginLeft: insets.left,
      marginRight: insets.right,
      padding: Math.max(contentPadding, dividerWidth),
      width: '100%',
      maxWidth: 960,
      alignSelf: 'center',
    },
    title: {
      color: palette.text,
      fontSize: height > 500 ? 28 : 20,
      fontWeight: '700',
      letterSpacing: 0.3,
      paddingHorizontal: 4,
      paddingTop: height > 500 ? 4 : 0,
      paddingBottom: height > 500 ? 16 : 8,
    },
    grid: {
      flex: 1,
      gap: dividerWidth,
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      gap: dividerWidth,
    },
  })
