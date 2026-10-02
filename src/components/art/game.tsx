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
  <Svg width={width} height={height} viewBox="0 0 40 160">
    <Rect x="14" y="2" width="12" height="12" rx="3" fill="#f4f1ea" />
    <Path
      d="M15 14h10v38c0 8 11 12 11 26v68a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8V78c0-14 11-18 11-26z"
      fill="#16634a"
    />
    <Rect x="4" y="86" width="32" height="40" fill="#f4f1ea" />
    <Rect x="10" y="98" width="20" height="4" rx="2" fill="#16634a" />
    <Rect x="10" y="108" width="14" height="4" rx="2" fill="#16634a" />
  </Svg>
)

const MATCH_WOOD = '#f1d49b'
const MATCH_HEAD = '#e23d3d'
const MATCH_BURNED = '#2a2724'

export const MatchArt = ({
  width,
  height,
  burned,
}: {
  width: number
  height: number
  burned: boolean
}) => (
  <Svg width={width} height={height} viewBox="0 0 10 100">
    <Rect x="2.2" y="6" width="5.6" height="94" rx="2.8" fill={burned ? '#cdb887' : MATCH_WOOD} />
    <Ellipse cx="5" cy="7" rx="4.8" ry="7" fill={burned ? MATCH_BURNED : MATCH_HEAD} />
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
