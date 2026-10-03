import * as Haptics from 'expo-haptics'
import {Platform} from 'react-native'

const run = (fn: () => Promise<unknown>) => {
  if (Platform.OS === 'web') {
    return
  }
  fn().catch(() => undefined)
}

/** Tactile feedback of the interactions, no-op where it is not supported. */
export const haptics = {
  /** a light tap, e.g. a thrown object has landed */
  tap: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** a firmer tap, e.g. a result was revealed */
  thud: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  select: () => run(() => Haptics.selectionAsync()),
  success: () =>
    run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () =>
    run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
}
