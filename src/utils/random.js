import rndColor from 'randomcolor'

export const randomNumber = (_min, _max) => {
  const min = Math.min(_min, _max)
  const max = Math.max(_min, _max)
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

export const uniqueRandomNumbers = (_min, _max, count) => {
  const min = Math.min(_min, _max)
  const max = Math.max(_min, _max)
  const allCount = max - min + 1
  const all = new Set(new Array(allCount).fill(0).map((a, i) => min + i))
  const results = []
  for (let i = 0; i < count; i++) {
    const idx = randomNumber(0, allCount - 1 - i)
    const number = [...all][idx]
    results.push(number)
    all.delete(number)
  }
  return results
}

export const randomBoolean = () => Math.random() >= 0.5

export const randomColor = options => rndColor({
  luminosity: 'dark',
  hue: 'blue',
  ...options,
})

