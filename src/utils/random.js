import rndColor from 'randomcolor'

export const randomNumber = (_min, _max) => {
  const min = Math.min(_min, _max)
  const max = Math.max(_min, _max)
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

export const randomBoolean = () => Math.random() >= 0.5

export const randomColor = options => rndColor({
  luminosity: 'dark',
  hue: 'blue',
  ...options,
})

