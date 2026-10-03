import React, {useRef, useState} from 'react'
import {Animated, Pressable, StyleSheet} from 'react-native'
import {PlayingCard} from '../components/art/game'
import {SectionProps, SectionTemplate} from '../components/SectionTemplate'
import {Metrics, useMetrics} from '../theme/metrics'
import {Card, shuffledDeck} from '../utils/cards'
import {USE_NATIVE_DRIVER} from '../utils/gesture'
import {haptics} from '../utils/haptics'
import {useReduceMotion} from '../utils/motion'

// scale of the edge-on card (0 does not work properly on android)
const EDGE = 0.0001
const FLIP_DURATION = 130

export const Cards = (props: SectionProps) => {
  const m = useMetrics()
  const reduceMotion = useReduceMotion()
  const [deck, setDeck] = useState(shuffledDeck)
  // the drawn card, `null` shows the back of the card
  const [card, setCard] = useState<Card | null>(null)
  const flip = useRef(new Animated.Value(1)).current
  const busy = useRef(false)
  const size = cardWidth(m)

  // turns the card edge-on, changes it and turns it back
  const turnTo = (next: Card | null, feedback: () => void) => {
    busy.current = true
    const duration = reduceMotion ? 0 : FLIP_DURATION
    Animated.timing(flip, {toValue: EDGE, duration, useNativeDriver: USE_NATIVE_DRIVER}).start(() => {
      setCard(next)
      feedback()
      Animated.timing(flip, {toValue: 1, duration, useNativeDriver: USE_NATIVE_DRIVER}).start(
        () => {
          busy.current = false
        },
      )
    })
  }

  const draw = () => {
    if (busy.current) {
      return
    }
    if (deck.length === 0) {
      haptics.warning()
      return
    }
    const [next, ...rest] = deck
    setDeck(rest)
    turnTo(next, haptics.thud)
  }

  const newGame = () => {
    if (busy.current) {
      return
    }
    setDeck(shuffledDeck())
    turnTo(null, haptics.tap)
  }

  const hint =
    deck.length === 0
      ? 'The deck is empty. Start a new game'
      : `Tap to draw  ·  ${deck.length} ${deck.length === 1 ? 'card' : 'cards'} left`

  return (
    <SectionTemplate {...props} hint={hint} onRefresh={newGame} style={s.container}>
      <Pressable
        style={s.touchable}
        onPress={draw}
        accessibilityRole="button"
        accessibilityLabel={card ? `Card ${card.rank} of ${card.suit}` : 'Deck of cards'}
        accessibilityHint="Draws a card">
        <Animated.View style={{transform: [{scaleX: flip}]}}>
          <PlayingCard width={size} card={card} />
        </Animated.View>
      </Pressable>
    </SectionTemplate>
  )
}

const cardWidth = ({contentHeight, contentWidth}: Metrics) =>
  Math.min((contentHeight * 0.88) / 1.4, contentWidth * 0.8, 280)

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
