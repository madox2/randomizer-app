import {shuffle} from './random'

/** Names from a text with one name per line (commas work as well). */
export const parsePlayers = (text: string): string[] =>
  text
    .split(/[\n,]+/)
    .map((name) => name.trim())
    .filter(Boolean)

export const formatPlayers = (players: readonly string[]): string => players.join('\n')

/**
 * Deals the shuffled players to the teams one by one, so the teams differ in
 * size by at most one player. There are never more teams than players.
 */
export const splitIntoTeams = (players: readonly string[], teamCount: number): string[][] => {
  const count = Math.max(1, Math.min(teamCount, players.length))
  const teams: string[][] = Array.from({length: players.length ? count : 0}, () => [])
  shuffle(players).forEach((player, i) => teams[i % count].push(player))
  return teams
}
