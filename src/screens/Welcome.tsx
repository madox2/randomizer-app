import React from 'react'
import {StyleSheet, View} from 'react-native'
import {SectionButton} from '../components/SectionButton'
import {useTheme} from '../theme/colors'
import {Metrics, useMetrics} from '../theme/metrics'
import {SectionId, sections} from './sections'

export type Rect = {x: number; y: number; width: number; height: number}

type Props = {
  /** `rect` is the position of the selected tile in the window */
  onSelect: (id: SectionId, rect: Rect | null) => void
}

export const Welcome = ({onSelect}: Props) => {
  const m = useMetrics()
  const theme = useTheme()
  const s = makeStyles(m)
  // sections are displayed in two columns
  const rows = [sections.slice(0, 2), sections.slice(2, 4), sections.slice(4, 6)]
  return (
    <View style={[s.container, {backgroundColor: theme.bg}]}>
      <View style={s.safeArea}>
        {rows.map((row, i) => (
          <View key={i} style={s.row}>
            {row.map(({id, title, color, type}) => (
              <SectionButton
                key={id}
                title={title}
                color={color}
                type={type}
                onPress={(view) => {
                  if (!view) {
                    onSelect(id, null)
                    return
                  }
                  view.measureInWindow((x, y, width, height) =>
                    onSelect(id, width > 0 && height > 0 ? {x, y, width, height} : null),
                  )
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}

const makeStyles = ({gap, insets}: Metrics) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
      gap,
      padding: gap,
      marginTop: insets.top,
      marginBottom: insets.bottom,
      marginLeft: insets.left,
      marginRight: insets.right,
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      gap,
    },
  })
