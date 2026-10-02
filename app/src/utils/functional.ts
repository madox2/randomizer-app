export const mapProps = <T, R>(
  obj: Record<string, T>,
  fn: (entry: [string, T]) => R,
): R[] =>
  Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .map((k) => fn([k, obj[k]]))

export const reduceProps = <T, R>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => R,
): Record<string, R> =>
  Object.keys(obj).reduce<Record<string, R>>((result, k) => {
    result[k] = fn(obj[k], k)
    return result
  }, {})

export const someProp = <T>(
  obj: Record<string, T>,
  fn: (value: T) => unknown,
): boolean => Object.keys(obj).some((k) => fn(obj[k]))
