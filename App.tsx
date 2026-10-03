import React, {useEffect, useRef, useState} from 'react'
import {
  Animated,
  BackHandler,
  Easing,
  Platform,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {Rect, Welcome} from './src/screens/Welcome'
import {SectionId, sections} from './src/screens/sections'
import {storage} from './src/services/storage'
import {useTheme} from './src/theme/colors'
import {useReduceMotion} from './src/utils/motion'

const TILE_RADIUS = 24

type Transition =
  | {type: 'open'; id: SectionId; rect: Rect}
  | {type: 'close'; id: SectionId}

export default function App() {
  const [ready, setReady] = useState(false)
  const [current, setCurrent] = useState<SectionId | null>(null)
  const [transition, setTransition] = useState<Transition | null>(null)
  const progress = useRef(new Animated.Value(0)).current
  const window = useWindowDimensions()
  const theme = useTheme()
  const reduceMotion = useReduceMotion()

  useEffect(() => {
    storage.init().then(() => setReady(true))
    if (Platform.OS === 'web') {
      document.title = 'Randomizer App - Random Generator'
    }
  }, [])

  const open = (id: SectionId, rect: Rect | null) => {
    if (transition) {
      return
    }
    if (!rect || reduceMotion) {
      setCurrent(id)
      return
    }
    progress.setValue(0)
    setTransition({type: 'open', id, rect})
    // the tile grows to fill the screen, then the section takes its place
    Animated.timing(progress, {
      toValue: 1,
      duration: 280,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      setCurrent(id)
      setTransition(null)
    })
  }

  const back = () => {
    if (current === null || transition) {
      return
    }
    if (reduceMotion) {
      setCurrent(null)
      return
    }
    progress.setValue(0)
    setTransition({type: 'close', id: current})
    setCurrent(null)
    // the section fades out and reveals the home screen below it
    Animated.timing(progress, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start(() => setTransition(null))
  }

  // hardware back button navigates back to the welcome screen
  const backRef = useRef(back)
  backRef.current = back
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (current === null && !transition) {
        return false
      }
      backRef.current()
      return true
    })
    return () => subscription.remove()
  }, [current, transition])

  const sectionId = current ?? (transition?.type === 'close' ? transition.id : null)
  const section = sections.find(({id}) => id === sectionId)
  const opening = transition?.type === 'open' ? transition : null
  const openingSection = opening && sections.find(({id}) => id === opening.id)

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={section ? 'light-content' : theme.dark ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, {backgroundColor: theme.bg}]}>
        {!ready ? null : (
          <>
            {current === null && (
              <View style={styles.fill} pointerEvents={transition ? 'none' : 'auto'}>
                <Welcome onSelect={open} />
              </View>
            )}
            {section && (
              <Animated.View
                key={section.id}
                style={[
                  styles.fill,
                  transition?.type === 'close' && {
                    opacity: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),
                    transform: [
                      {
                        scale: progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.96],
                        }),
                      },
                    ],
                  },
                ]}
                pointerEvents={transition ? 'none' : 'auto'}>
                <section.Component
                  title={section.title}
                  color={section.color}
                  hint={section.hint}
                  onBack={back}
                />
              </Animated.View>
            )}
            {opening && openingSection && (
              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  backgroundColor: openingSection.color,
                  left: progress.interpolate({inputRange: [0, 1], outputRange: [opening.rect.x, 0]}),
                  top: progress.interpolate({inputRange: [0, 1], outputRange: [opening.rect.y, 0]}),
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [opening.rect.width, window.width],
                  }),
                  height: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [opening.rect.height, window.height],
                  }),
                  borderRadius: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [TILE_RADIUS, 0],
                  }),
                }}
              />
            )}
          </>
        )}
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fill: {
    ...StyleSheet.absoluteFill,
  },
})
