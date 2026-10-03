import {useWindowDimensions} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

export type Metrics = {
  width: number
  height: number
  landscape: boolean
  insets: {top: number; bottom: number; left: number; right: number}
  /** gap between the home screen tiles */
  gap: number
  topBarHeight: number
  bottomBarHeight: number
  /** the area between the top and the bottom bar */
  contentHeight: number
  contentWidth: number
  contentPadding: number
}

export const TOP_BAR_HEIGHT = 64
export const BOTTOM_BAR_HEIGHT = 96

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
  // multiple of 4 close to 4% of the shorter side
  const contentPadding = Math.max(12, Math.round((Math.min(width, height) * 0.04) / 4) * 4)
  return {
    width,
    height,
    landscape: width > height,
    insets,
    gap: 12,
    topBarHeight: TOP_BAR_HEIGHT,
    bottomBarHeight: BOTTOM_BAR_HEIGHT,
    contentPadding,
    contentHeight: height - TOP_BAR_HEIGHT - BOTTOM_BAR_HEIGHT,
    contentWidth: width - 2 * contentPadding,
  }
}

export const useMetrics = (): Metrics => {
  const {width, height} = useWindowDimensions()
  const insets = useSafeAreaInsets()
  return computeMetrics(width, height, insets)
}
