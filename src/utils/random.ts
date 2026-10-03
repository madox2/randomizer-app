export const randomNumber = (a: number, b: number): number => {
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

export const uniqueRandomNumbers = (
  a: number,
  b: number,
  count: number,
): number[] => {
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  const available = Array.from({length: max - min + 1}, (_, i) => min + i)
  const results: number[] = []
  for (let i = 0; i < count && available.length > 0; i++) {
    const [picked] = available.splice(randomNumber(0, available.length - 1), 1)
    results.push(picked)
  }
  return results
}

export const randomBoolean = (): boolean => Math.random() >= 0.5

const randomWithin = (min: number, max: number): number =>
  min + Math.random() * (max - min)

// Brightness lower bounds (saturation, brightness) of the blue hue range.
const BLUE_LOWER_BOUNDS = [
  [20, 100],
  [30, 86],
  [40, 80],
  [50, 74],
  [60, 60],
  [70, 52],
  [80, 44],
  [90, 39],
  [100, 35],
]

const minimumBrightness = (saturation: number): number => {
  for (let i = 0; i < BLUE_LOWER_BOUNDS.length - 1; i++) {
    const [s1, v1] = BLUE_LOWER_BOUNDS[i]
    const [s2, v2] = BLUE_LOWER_BOUNDS[i + 1]
    if (saturation >= s1 && saturation <= s2) {
      return v1 + ((v2 - v1) / (s2 - s1)) * (saturation - s1)
    }
  }
  return 0
}

const hsvToHex = (h: number, s: number, v: number): string => {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    const channel = v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
    return Math.round(channel * 255)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(5)}${f(3)}${f(1)}`
}

/**
 * Random dark blue color (hue 179-257, saturation 90-100, brightness
 * derived from the saturation) used for the numbers.
 */
export const randomColor = (): string => {
  const hue = randomWithin(179, 257)
  const saturation = randomWithin(90, 100)
  const bMin = minimumBrightness(saturation)
  const brightness = randomWithin(bMin, bMin + 20)
  return hsvToHex(hue, saturation / 100, brightness / 100)
}

/** Returns a shuffled copy of the list (Fisher-Yates). */
export const shuffle = <T>(items: readonly T[]): T[] => {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomNumber(0, i)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
