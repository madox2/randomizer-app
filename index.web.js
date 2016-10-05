import { AppRegistry } from 'react-native'
import { App } from './src/App'

AppRegistry.registerComponent('randomizerapp', () => App)
AppRegistry.runApplication('randomizerapp', {
  rootTag: document.getElementById('react-root'),
})
