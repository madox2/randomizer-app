import {useColorScheme} from 'react-native'

export type Theme = {
  dark: boolean
  /** app background */
  bg: string
  /** sheets, cards */
  surface: string
  text: string
  textMuted: string
  border: string
  inputBg: string
  danger: string
  scrim: string
}

const light: Theme = {
  dark: false,
  bg: '#f4f5f7',
  surface: '#ffffff',
  text: '#1b1c1f',
  textMuted: '#6a6e76',
  border: '#e3e5e9',
  inputBg: '#f0f1f4',
  danger: '#d1352b',
  scrim: 'rgba(10, 10, 14, 0.5)',
}

const dark: Theme = {
  dark: true,
  bg: '#0f1013',
  surface: '#1c1d22',
  text: '#f3f4f6',
  textMuted: '#9a9ea7',
  border: '#2c2e35',
  inputBg: '#272930',
  danger: '#ff7468',
  scrim: 'rgba(0, 0, 0, 0.6)',
}

export const useTheme = (): Theme =>
  useColorScheme() === 'dark' ? dark : light

/** Text and icons placed over the section colors. */
export const ON_COLOR = '#ffffff'
/** Soft text (hints) over the section colors. */
export const ON_COLOR_SOFT = 'rgba(255, 255, 255, 0.8)'
/**
 * Fill of buttons and pills displayed over a section color. A translucent
 * black darkens any section color, so white content keeps its contrast.
 */
export const CONTROL_FILL = 'rgba(0, 0, 0, 0.16)'
export const CONTROL_FILL_PRESSED = 'rgba(0, 0, 0, 0.28)'

/**
 * Section colors: similar saturation and lightness, white text on each of
 * them has a contrast of at least 3.3:1 (the labels are large and bold).
 */
export const sectionColors = {
  numbers: '#cf7500',
  coin: '#0d7f86',
  bottle: '#dc4a3a',
  ball: '#6f4bd0',
  matches: '#3f8f3a',
  dice: '#2f66d0',
  cards: '#c23a7a',
  teams: '#4f6081',
} as const

export const fonts = {
  /** font sizes */
  size: {caption: 13, body: 16, title: 20, heading: 28},
  semibold: '600',
  bold: '700',
} as const
