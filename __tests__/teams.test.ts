import {shuffledDeck} from '../src/utils/cards'
import {shuffle} from '../src/utils/random'
import {formatPlayers, parsePlayers, splitIntoTeams} from '../src/utils/teams'

describe('shuffle', () => {
  it('keeps all items and does not change the input', () => {
    const items = [1, 2, 3, 4, 5, 6]
    const result = shuffle(items)
    expect(items).toEqual([1, 2, 3, 4, 5, 6])
    expect([...result].sort()).toEqual(items)
  })

  it('can produce a different order', () => {
    const random = jest.spyOn(Math, 'random').mockReturnValue(0)
    expect(shuffle([1, 2, 3])).not.toEqual([1, 2, 3])
    random.mockRestore()
  })
})

describe('shuffledDeck', () => {
  it('has 52 different cards', () => {
    const deck = shuffledDeck()
    expect(deck).toHaveLength(52)
    expect(new Set(deck.map(({rank, suit}) => `${rank}-${suit}`)).size).toBe(52)
  })
})

describe('parsePlayers', () => {
  it('splits lines and commas and drops empty names', () => {
    expect(parsePlayers(' Anna\n\nBen, Cleo ,\n  ')).toEqual(['Anna', 'Ben', 'Cleo'])
  })

  it('round-trips through formatPlayers', () => {
    expect(parsePlayers(formatPlayers(['Anna', 'Ben']))).toEqual(['Anna', 'Ben'])
  })
})

describe('splitIntoTeams', () => {
  const players = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

  it('puts every player to exactly one team', () => {
    const teams = splitIntoTeams(players, 3)
    expect(teams).toHaveLength(3)
    expect(teams.flat().sort()).toEqual(players)
  })

  it('makes teams which differ in size by at most one', () => {
    const sizes = splitIntoTeams(players, 3).map((team) => team.length)
    expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1)
  })

  it('never makes more teams than players', () => {
    expect(splitIntoTeams(['A', 'B'], 5)).toHaveLength(2)
  })

  it('returns no teams without players', () => {
    expect(splitIntoTeams([], 3)).toEqual([])
  })
})
