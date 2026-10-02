import React from 'react'
import {StyleSheet, View} from 'react-native'
import {SectionButton} from '../components/SectionButton'
import {Metrics, useMetrics} from '../theme/metrics'
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
        {rows.map((row, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={s.hdivider} />}
            <View style={s.row}>
              {row.map(({id, title, color, type}, j) => (
                <React.Fragment key={id}>
                  {j > 0 && <View style={s.vdivider} />}
                  <SectionButton
                    title={title}
                    color={color}
                    type={type}
                    onPress={() => onSelect(id)}
                  />
                </React.Fragment>
              ))}
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  )
}

const makeStyles = ({dividerWidth, insets}: Metrics) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    safeArea: {
      flex: 1,
      marginTop: insets.top,
      marginBottom: insets.bottom,
      marginLeft: insets.left,
      marginRight: insets.right,
    },
    row: {
      flex: 1,
      flexDirection: 'row',
    },
    vdivider: {
      width: dividerWidth,
    },
    hdivider: {
      height: dividerWidth,
    },
  })
