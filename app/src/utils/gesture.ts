import {useRef, useState} from 'react'
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
  Platform,
} from 'react-native'

export type Gesture = PanResponderGestureState

/** Native driver is not available on web. */
export const USE_NATIVE_DRIVER = Platform.OS !== 'web'

type Handlers = {
  onStart?: (state: Gesture) => void
  onMove?: (state: Gesture) => void
  onEnd?: (state: Gesture) => void
}

type Options = {
  /** Take over the responder on touch start (instead of waiting for a move). */
  captureStart?: boolean
  /** Take over the responder when the touch moves. */
  captureMove?: boolean
}

/**
 * Pan responder always calling the latest handlers.
 */
export const usePanResponder = (
  handlers: Handlers,
  {captureStart = false, captureMove = false}: Options = {},
): PanResponderInstance => {
  const latest = useRef(handlers)
  latest.current = handlers
  const [panResponder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => captureStart,
      onStartShouldSetPanResponderCapture: () => captureStart,
      onMoveShouldSetPanResponderCapture: () => captureMove,
      onPanResponderTerminationRequest: () => true,
      onPanResponderGrant: (_: GestureResponderEvent, state) =>
        latest.current.onStart?.(state),
      onPanResponderMove: (_: GestureResponderEvent, state) =>
        latest.current.onMove?.(state),
      onPanResponderRelease: (_: GestureResponderEvent, state) =>
        latest.current.onEnd?.(state),
    }),
  )
  return panResponder
}
