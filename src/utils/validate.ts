export type NumberConstraints = {min?: number; max?: number}

/**
 * Validates a value of the number input.
 * Returns an error message or null when the value is valid.
 */
export const validate = (
  value: number | string,
  constraints: NumberConstraints = {},
): string | null => {
  const {min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER} =
    constraints
  if (value === '') {
    return 'Cannot be empty'
  }
  if (!Number.isSafeInteger(value)) {
    return 'Invalid number format'
  }
  const n = value as number
  if (n < min) {
    return `Minimum value is ${min}`
  }
  if (n > max) {
    return `Maximum value is ${max}`
  }
  return null
}

const length = (x: unknown) => `${x}`.length

/**
 * Converts the text to a number unless the conversion would change the text
 * (e.g. `007`, `1e3` or `3.0`); such a text is kept and fails the validation.
 */
export const sanitize = (text: string): number | string =>
  /^-?\d+$/.test(text) && length(text) === length(+text) ? +text : text
