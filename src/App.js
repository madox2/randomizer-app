import React from 'react'
import { Navigator } from './components/Navigator'
import { Welcome} from './screens'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

ResponsiveStyleSheet.setExtension(({ width, height }) => {
  const dividerWidth = 4
  const length = Math.max(width, height)
  const controlsSize = 100
  const contentSize = length - controlsSize
  return { dividerWidth, controlsSize, contentSize }
})

export const App = () => (
  <Navigator root={Welcome} />
)
