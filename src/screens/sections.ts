import {ComponentType} from 'react'
import {GlyphName} from '../components/art/icons'
import {SectionProps} from '../components/SectionTemplate'
import {sectionColors} from '../theme/colors'
import {Bottle} from './Bottle'
import {Cards} from './Cards'
import {Coin} from './Coin'
import {Dices} from './Dices'
import {MagicBall} from './MagicBall'
import {Matches} from './Matches'
import {Numbers} from './Numbers'
import {Teams} from './Teams'

export type SectionId = 'numbers' | 'coin' | 'bottle' | 'ball' | 'matches' | 'dice' | 'cards' | 'teams'

export type Section = {
  id: SectionId
  title: string
  color: string
  /** short instruction displayed at the bottom of the screen */
  hint: string
  type: GlyphName
  Component: ComponentType<SectionProps>
}

export const sections: Section[] = [
  {
    id: 'numbers',
    title: 'Numbers',
    color: sectionColors.numbers,
    hint: 'Tap to roll',
    type: 'numbers',
    Component: Numbers,
  },
  {
    id: 'coin',
    title: 'Coin',
    color: sectionColors.coin,
    hint: 'Drag the coin up and let go to flip it',
    type: 'coin',
    Component: Coin,
  },
  {
    id: 'bottle',
    title: 'Bottle',
    color: sectionColors.bottle,
    hint: 'Swipe around the bottle to spin it',
    type: 'bottle',
    Component: Bottle,
  },
  {
    id: 'ball',
    title: 'Magic 8-Ball',
    color: sectionColors.ball,
    hint: 'Think of a question, then tap the ball',
    type: 'ball',
    Component: MagicBall,
  },
  {
    id: 'matches',
    title: 'Matches',
    color: sectionColors.matches,
    hint: 'Pull a match up. Someone gets the burned one',
    type: 'matches',
    Component: Matches,
  },
  {
    id: 'dice',
    title: 'Dices',
    color: sectionColors.dice,
    hint: 'Tap to throw',
    type: 'dice',
    Component: Dices,
  },
  {
    id: 'cards',
    title: 'Cards',
    color: sectionColors.cards,
    hint: 'Tap to draw',
    type: 'cards',
    Component: Cards,
  },
  {
    id: 'teams',
    title: 'Teams',
    color: sectionColors.teams,
    hint: 'Add players and shuffle them into teams',
    type: 'teams',
    Component: Teams,
  },
]
