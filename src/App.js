import React from 'react'
import { Navigator } from './components/Navigator'
import { Welcome} from './screens'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'

ResponsiveStyleSheet.setExtension(() => {
  const dividerWidth = 4
  return { dividerWidth }
})

export const App = () => (
  <Navigator root={Welcome} />
)
