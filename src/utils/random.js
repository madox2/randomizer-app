
export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

export const randomBoolean = () => Math.random() >= 0.5
