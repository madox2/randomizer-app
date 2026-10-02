import React, {useEffect, useState} from 'react'
import {BackHandler, Platform, StyleSheet, View} from 'react-native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {Welcome} from './src/screens/Welcome'
import {SectionId, sections} from './src/screens/sections'
import {storage} from './src/services/storage'

export default function App() {
  const [ready, setReady] = useState(false)
  const [current, setCurrent] = useState<SectionId | null>(null)

  useEffect(() => {
    storage.init().then(() => setReady(true))
    if (Platform.OS === 'web') {
      document.title = 'Randomizer App - Random Generator'
    }
  }, [])

  // hardware back button navigates back to the welcome screen
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (current === null) {
        return false
      }
      setCurrent(null)
      return true
    })
    return () => subscription.remove()
  }, [current])

  const section = sections.find(({id}) => id === current)

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {!ready ? null : section ? (
          <section.Component
            key={section.id}
            color={section.color}
            buttonColor={section.buttonColor}
            type={section.type}
            onBack={() => setCurrent(null)}
          />
        ) : (
          <Welcome onSelect={setCurrent} />
        )}
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})
