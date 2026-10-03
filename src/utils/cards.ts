import {shuffle} from './random'

export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'
export type Card = {rank: string; suit: Suit}

export const SUITS: readonly Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']
export const RANKS: readonly string[] = [
  'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
]

/** A shuffled deck of 52 cards. */
export const shuffledDeck = (): Card[] =>
  shuffle(SUITS.flatMap((suit) => RANKS.map((rank) => ({rank, suit}))))
