export const mapProps = (obj, fn) => Object.keys(obj).map(k => fn([ k, obj[k] ]))

export const reduceProps = (obj, fn) => Object.keys(obj).reduce((r, k) => ({
  ...r,
  [k]: fn(obj[k], k),
}), {})

export const someProp = (obj, fn) => Object.keys(obj).some(k => fn(obj[k]))

