import rndColor from 'randomcolor'

export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

export const randomBoolean = () => Math.random() >= 0.5

export const randomColor = options => rndColor({
  luminosity: 'dark',
  hue: 'blue',
  ...options,
})

