import React from 'react'
import Svg, {Circle, ClipPath, Defs, Ellipse, G, Path, Rect, Text as SvgText} from 'react-native-svg'

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

const CARD_RED = '#d1352b'
const CARD_BLACK = '#1b1c1f'
const CARD_BACK = '#a82f68'

/** A suit symbol drawn in a 24x24 box. */
const Suit = ({suit, x, y, size, fill}: {suit: string; x: number; y: number; size: number; fill: string}) => (
  <G transform={`translate(${x} ${y}) scale(${size / 24})`}>
    {suit === 'hearts' && (
      <Path d="M12 21C5 15 2 11.5 2 8a5 5 0 0 1 10-1.5A5 5 0 0 1 22 8c0 3.5-3 7-10 13z" fill={fill} />
    )}
    {suit === 'diamonds' && <Path d="M12 2l8 10-8 10-8-10z" fill={fill} />}
    {suit === 'spades' && (
      <Path
        d="M12 2C7 8 3 11 3 15a4.5 4.5 0 0 0 8 2.8c-.2 2-1 3.3-2.5 4.2h7c-1.5-.9-2.3-2.2-2.5-4.2A4.5 4.5 0 0 0 21 15c0-4-4-7-9-13z"
        fill={fill}
      />
    )}
    {suit === 'clubs' && (
      <>
        <Circle cx="12" cy="7.5" r="4.5" fill={fill} />
        <Circle cx="6.5" cy="14.5" r="4.5" fill={fill} />
        <Circle cx="17.5" cy="14.5" r="4.5" fill={fill} />
        <Path d="M12 13c.2 3-.5 6-2.5 9h5c-2-3-2.7-6-2.5-9z" fill={fill} />
      </>
    )}
  </G>
)

/** A playing card (5:7), the back is shown without a card. */
export const PlayingCard = ({
  width,
  card,
}: {
  width: number
  card: {rank: string; suit: string} | null
}) => {
  const ink = card && (card.suit === 'hearts' || card.suit === 'diamonds') ? CARD_RED : CARD_BLACK
  return (
    <Svg width={width} height={width * 1.4} viewBox="0 0 100 140">
      <Rect x="1" y="1" width="98" height="138" rx="9" fill="#fff" stroke="#d7d9de" strokeWidth={1} />
      {card ? (
        [0, 1].map((half) => (
          // the second corner is the first one turned around
          <G key={half} transform={half ? 'rotate(180 50 70)' : undefined}>
            <SvgText x="15" y="27" fontSize="22" fontWeight="bold" fill={ink} textAnchor="middle">
              {card.rank}
            </SvgText>
            <Suit suit={card.suit} x={6} y={32} size={18} fill={ink} />
            {half === 0 && <Suit suit={card.suit} x={25} y={43} size={50} fill={ink} />}
          </G>
        ))
      ) : (
        <>
          <Rect x="8" y="8" width="84" height="124" rx="5" fill={CARD_BACK} />
          <Defs>
            <ClipPath id="cardBack">
              <Rect x="8" y="8" width="84" height="124" rx="5" />
            </ClipPath>
          </Defs>
          <G clipPath="url(#cardBack)" stroke="#fff" strokeOpacity={0.28} strokeWidth={2}>
            <Path d="M0 28L28 0M0 56L56 0M0 84L84 0M0 112L112 0M0 140L140 0M28 140L140 28M56 140L140 56M84 140L140 84" />
            <Path d="M0 112L28 140M0 84L56 140M0 56L84 140M0 28L112 140M0 0L140 140M28 0L140 112M56 0L140 84M84 0L140 56" />
          </G>
          <Rect x="8" y="8" width="84" height="124" rx="5" fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={1.5} />
        </>
      )}
    </Svg>
  )
}
