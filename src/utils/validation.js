const err = err => ({ valid: false, err })

export const validateNumber = (value, options = {}) => {
  const {
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
  } = options
  if (!Number.isSafeInteger(value)) return err(`Invalid number format`)
  if (value < min) return err(`Minimum value is ${min}`)
  if (value > max) return err(`Maximum value is ${max}`)
  return { valid: true }
}

export const validateText = () => false
