import {useEffect, useState} from 'react'
import {AccessibilityInfo} from 'react-native'

/** True when the user asked the system to reduce animations. */
export const useReduceMotion = (): boolean => {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    let mounted = true
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => mounted && setReduce(value))
      .catch(() => undefined)
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduce,
    )
    return () => {
      mounted = false
      subscription.remove()
    }
  }, [])
  return reduce
}
