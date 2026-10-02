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
    color: '#f9be3e',
    buttonColor: '#d89c19',
    type: 'numbers',
    Component: Numbers,
  },
  {
    id: 'coin',
    title: 'Coin',
    color: '#067b82',
    buttonColor: '#07565a',
    type: 'coin',
    Component: Coin,
  },
  {
    id: 'bottle',
    title: 'Bottle',
    color: '#f06060',
    buttonColor: '#c33939',
    type: 'bottle',
    Component: Bottle,
  },
  {
    id: 'ball',
    title: 'Magic 8-Ball',
    color: '#86a73f',
    buttonColor: '#5d7d17',
    type: 'ball',
    Component: MagicBall,
  },
  {
    id: 'matches',
    title: 'Matches',
    color: '#92c2b8',
    buttonColor: '#63a094',
    type: 'matches',
    Component: Matches,
  },
  {
    id: 'dice',
    title: 'Dices',
    color: '#e5a959',
    buttonColor: '#c78123',
    type: 'dice',
    Component: Dices,
  },
]
