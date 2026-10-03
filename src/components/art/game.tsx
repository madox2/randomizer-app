import React from 'react'
import Svg, {Circle, Ellipse, Path, Rect, Text as SvgText} from 'react-native-svg'

/** Flat illustrations of the game objects. */

const COIN = '#ffd04a'
const COIN_EDGE = '#e8a91c'
const COIN_MARK = '#b9780a'

export const CoinFace = ({size, side}: {size: number; side: 'heads' | 'tails'}) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="48" fill={COIN_EDGE} />
    <Circle cx="50" cy="50" r="42" fill={COIN} />
    <Circle cx="50" cy="50" r="33" fill="none" stroke={COIN_EDGE} strokeWidth={3} />
    {side === 'heads' ? (
      <Path
        d="M50 27l6.8 14.2 15.5 2-11.4 10.8 2.9 15.4L50 61.8 36.2 69.4l2.9-15.4L27.7 43.2l15.5-2z"
        fill={COIN_MARK}
      />
    ) : (
      <SvgText x="50" y="65" fontSize="46" fontWeight="bold" fill={COIN_MARK} textAnchor="middle">
        1
      </SvgText>
    )}
  </Svg>
)

/** Bottle lying along its vertical axis, the neck points up. */
export const BottleArt = ({width, height}: {width: number; height: number}) => (
  <Svg width={width} height={height} viewBox="0 0 100 400">
    {/* glass */}
    <Path
      d="M38 6h24v10h-2v70c0 22 6 34 16 52 14 24 24 42 24 76v152c0 18-12 28-30 28H30C12 394 0 384 0 366V214c0-34 10-52 24-76 10-18 16-30 16-52V16h-2z"
      fill="#1f6b3b"
    />
    {/* shaded side */}
    <Path
      d="M62 16v70c0 22 6 34 16 52 14 24 22 42 22 76v152c0 18-10 28-28 28h-8c18 0 22-10 22-28V214c0-34-8-52-22-76-10-18-14-30-14-52V16z"
      fill="#17552f"
    />
    {/* neck lip */}
    <Rect x="36" y="2" width="28" height="12" rx="4" fill="#2a8449" />
    {/* highlights */}
    <Rect x="14" y="236" width="6" height="146" rx="3" fill="#fff" opacity={0.9} />
    <Rect x="25" y="236" width="6" height="146" rx="3" fill="#fff" opacity={0.9} />
    <Rect x="44" y="30" width="5" height="40" rx="2.5" fill="#fff" opacity={0.9} />
  </Svg>
)

const WOOD_LIGHT = '#f7da8b'
const WOOD_DARK = '#d9a521'
const HEAD_LIGHT = '#e8392f'
const HEAD_DARK = '#b8231c'
const CHAR_LIGHT = '#322a27'
const CHAR_DARK = '#1b1513'
const SCORCH_LIGHT = '#8a5a2b'
const SCORCH_DARK = '#6a4119'

// the head, a drop: the left half is lit, the right half is in the shade
const HEAD = 'M10 2C15.5 2 19 8.5 19 17C19 24 15 29 10 29C5 29 1 24 1 17C1 8.5 4.5 2 10 2Z'
const HEAD_SHADE = 'M10 2C15.5 2 19 8.5 19 17C19 24 15 29 10 29Z'

/**
 * A match standing upright, the head is on top. A burned match has a charred
 * head and a burned top part of the stick with a ragged edge to the wood.
 */
export const MatchArt = ({
  width,
  height,
  burned,
}: {
  width: number
  height: number
  burned: boolean
}) => (
  <Svg width={width} height={height} viewBox="0 0 20 200">
    {/* stick: lit left half, shaded right half */}
    <Path d="M5 27H10V199L5.6 197.4Z" fill={WOOD_LIGHT} />
    <Path d="M10 27H15V197.4L10 199Z" fill={WOOD_DARK} />
    {burned && (
      <>
        {/* scorched wood below the char */}
        <Path d="M5 27H10V101L8.9 95L7.5 104L6.3 95L5 99Z" fill={SCORCH_LIGHT} />
        <Path d="M10 27H15V95L13.6 102L12.2 94L11 103L10 101Z" fill={SCORCH_DARK} />
        {/* char */}
        <Path d="M5 27H10V96L9 90L7.6 99L6.4 90L5 94Z" fill={CHAR_LIGHT} />
        <Path d="M10 27H15V90L13.6 97L12.2 89L11 98L10 96Z" fill={CHAR_DARK} />
      </>
    )}
    {/* head */}
    <Path d={HEAD} fill={burned ? CHAR_LIGHT : HEAD_LIGHT} />
    <Path d={HEAD_SHADE} fill={burned ? CHAR_DARK : HEAD_DARK} />
    {/* the glint on the head: a shine, or the last glow of a burned match */}
    <Ellipse
      cx="6.6"
      cy="11"
      rx="1.7"
      ry="4"
      fill={burned ? '#f2b83a' : '#ff8a7c'}
      opacity={burned ? 0.9 : 0.85}
    />
  </Svg>
)

export const DieFace = ({
  size,
  value,
  pip,
}: {
  size: number
  value: number
  pip: string
}) => {
  const near = 28
  const far = 72
  const mid = 50
  const spots: Record<number, [number, number][]> = {
    1: [[mid, mid]],
    2: [[near, near], [far, far]],
    3: [[near, near], [mid, mid], [far, far]],
    4: [[near, near], [far, near], [near, far], [far, far]],
    5: [[near, near], [far, near], [mid, mid], [near, far], [far, far]],
    6: [[near, near], [far, near], [near, mid], [far, mid], [near, far], [far, far]],
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect x="2" y="2" width="96" height="96" rx="22" fill="#fff" />
      {(spots[value] ?? []).map(([x, y]) => (
        <Circle key={`${x}-${y}`} cx={x} cy={y} r="9" fill={pip} />
      ))}
    </Svg>
  )
}

/** The ball body with a soft flat highlight. */
export const BallBody = ({size}: {size: number}) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="50" fill="#1d1c24" />
  </Svg>
)

export const BallTriangle = ({
  width,
  height,
  color,
}: {
  width: number
  height: number
  color: string
}) => (
  <Svg width={width} height={height} viewBox="0 0 100 87">
    <Path d="M50 0L100 87H0z" fill={color} />
  </Svg>
)
