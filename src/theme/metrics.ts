import {useWindowDimensions} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

export type Metrics = {
  width: number
  height: number
  landscape: boolean
  insets: {top: number; bottom: number; left: number; right: number}
  dividerWidth: number
  controlsHeight: number
  contentHeight: number
  contentWidth: number
  contentPadding: number
  headingFontSize: number
  settingsHeight: number
  controlButtonSize: number
}

/**
 * Sizes derived from the area of the window which is not covered by system bars.
 */
export const computeMetrics = (
  windowWidth: number,
  windowHeight: number,
  insets: Metrics['insets'],
): Metrics => {
  const width = windowWidth - insets.left - insets.right
  const height = windowHeight - insets.top - insets.bottom
  const size = Math.max(width, height)
  const minSize = Math.min(width, height)
  const contentPadding = minSize * 0.04
  return {
    width,
    height,
    landscape: width > height,
    insets,
    dividerWidth: 12,
    controlsHeight: 100,
    contentPadding,
    contentHeight: height - 2 * contentPadding,
    contentWidth: width - 2 * contentPadding,
    headingFontSize: size > 700 ? 28 : 18,
    settingsHeight: 22,
    controlButtonSize: 70,
  }
}

export const useMetrics = (): Metrics => {
  const {width, height} = useWindowDimensions()
  const insets = useSafeAreaInsets()
  return computeMetrics(width, height, insets)
}
