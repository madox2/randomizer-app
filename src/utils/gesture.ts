import {useRef, useState} from 'react'
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
  Platform,
  ViewStyle,
} from 'react-native'

export type Gesture = PanResponderGestureState

/**
 * Style of the views controlled by a drag. On web the browser would otherwise
 * claim a vertical drag for scrolling or pulling the page, or start selecting
 * text, which cancels the gesture.
 */
export const DRAG_AREA_STYLE: ViewStyle =
  Platform.OS === 'web'
    ? ({touchAction: 'none', userSelect: 'none'} as ViewStyle)
    : {}

/** Native driver is not available on web. */
export const USE_NATIVE_DRIVER = Platform.OS !== 'web'

type Handlers = {
  onStart?: (state: Gesture) => void
  onMove?: (state: Gesture) => void
  onEnd?: (state: Gesture) => void
  /** The gesture was taken over by the system, e.g. by the browser. */
  onTerminate?: (state: Gesture) => void
}

type Options = {
  /** Take over the responder on touch start (instead of waiting for a move). */
  captureStart?: boolean
  /** Take over the responder when the touch moves. */
  captureMove?: boolean
  /**
   * Give up the gesture when asked to, e.g. by a scroll view. A gesture which
   * must not be interrupted keeps it.
   */
  allowTermination?: boolean
}

/**
 * Pan responder always calling the latest handlers.
 */
export const usePanResponder = (
  handlers: Handlers,
  {captureStart = false, captureMove = false, allowTermination = true}: Options = {},
): PanResponderInstance => {
  const latest = useRef(handlers)
  latest.current = handlers
  const [panResponder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => captureStart,
      onStartShouldSetPanResponderCapture: () => captureStart,
      onMoveShouldSetPanResponderCapture: () => captureMove,
      onPanResponderTerminationRequest: () => allowTermination,
      onPanResponderGrant: (_: GestureResponderEvent, state) =>
        latest.current.onStart?.(state),
      onPanResponderMove: (_: GestureResponderEvent, state) =>
        latest.current.onMove?.(state),
      onPanResponderTerminate: (_: GestureResponderEvent, state) =>
        latest.current.onTerminate?.(state),
      onPanResponderRelease: (_: GestureResponderEvent, state) =>
        latest.current.onEnd?.(state),
    }),
  )
  return panResponder
}
