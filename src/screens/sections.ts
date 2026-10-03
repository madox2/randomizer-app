import {ComponentType} from 'react'
import {IconName} from '../resources/images'
import {SectionProps} from '../components/SectionTemplate'
import {Bottle} from './Bottle'
import {Coin} from './Coin'
import {Dices} from './Dices'
import {MagicBall} from './MagicBall'
import {Matches} from './Matches'
import {Numbers} from './Numbers'

export type SectionId = 'numbers' | 'coin' | 'bottle' | 'ball' | 'matches' | 'dice'

export type Section = {
  id: SectionId
  title: string
  color: string
  /** color of the buttons displayed over the section background */
  buttonColor: string
  type: IconName
  Component: ComponentType<SectionProps>
}

export const sections: Section[] = [
  {
    id: 'numbers',
    title: 'Numbers',
    color: '#f5b83d',
    buttonColor: '#dc9a14',
    type: 'numbers',
    Component: Numbers,
  },
  {
    id: 'coin',
    title: 'Coin',
    color: '#13808a',
    buttonColor: '#0d5e66',
    type: 'coin',
    Component: Coin,
  },
  {
    id: 'bottle',
    title: 'Bottle',
    color: '#ee6a63',
    buttonColor: '#c9453f',
    type: 'bottle',
    Component: Bottle,
  },
  {
    id: 'ball',
    title: 'Magic 8-Ball',
    color: '#80a84d',
    buttonColor: '#5f8730',
    type: 'ball',
    Component: MagicBall,
  },
  {
    id: 'matches',
    title: 'Matches',
    color: '#7fbbab',
    buttonColor: '#58998a',
    type: 'matches',
    Component: Matches,
  },
  {
    id: 'dice',
    title: 'Dices',
    color: '#eba64c',
    buttonColor: '#cc8426',
    type: 'dice',
    Component: Dices,
  },
]
