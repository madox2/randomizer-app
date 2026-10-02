import {ON_COLOR, sectionColors} from '../src/theme/colors'

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a: string, b: string) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

describe('section colors', () => {
  it.each(Object.entries(sectionColors))(
    'keeps white content readable on %s',
    (_name, color) => {
      // WCAG AA for large (or bold) text is 3:1
      expect(contrast(ON_COLOR, color)).toBeGreaterThanOrEqual(3.3)
    },
  )

  it('uses a different color for every section', () => {
    const colors = Object.values(sectionColors)
    expect(new Set(colors).size).toBe(colors.length)
  })
})
