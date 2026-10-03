import React from 'react'
import Svg, {Circle, Path, Rect, Text as SvgText} from 'react-native-svg'

export type UiIconName = 'back' | 'refresh' | 'settings'

type Props = {name: UiIconName; size?: number; color?: string}

const stroke = {
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
} as const

/** Small line icons (24x24) used by the buttons. */
export const UiIcon = ({name, size = 24, color = '#fff'}: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...stroke}>
    {name === 'back' && <Path d="M15 5l-7 7 7 7" />}
    {name === 'refresh' && (
      <>
        <Path d="M20 11a8 8 0 1 0-2.3 5.7" />
        <Path d="M20 4v7h-7" />
      </>
    )}
    {name === 'settings' && (
      <>
        <Path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
        <Circle cx="15" cy="7" r="2" />
        <Circle cx="9" cy="17" r="2" />
      </>
    )}
  </Svg>
)

export type GlyphName = 'numbers' | 'coin' | 'bottle' | 'ball' | 'matches' | 'dice' | 'cards' | 'teams'

type GlyphProps = {name: GlyphName; size: number; color?: string; cutout: string}

/** Flat white glyphs (64x64) of the sections, `cutout` is the tile color. */
export const Glyph = ({name, size, color = '#fff', cutout}: GlyphProps) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    {name === 'numbers' && (
      <>
        <Path
          d="M24 10L18 54M42 10L36 54M10 24h44M8 40h44"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
        />
      </>
    )}
    {name === 'coin' && (
      <>
        <Circle cx="32" cy="32" r="26" fill={color} />
        <Circle cx="32" cy="32" r="19" fill="none" stroke={cutout} strokeWidth={3} />
        <SvgText x="32" y="42" fontSize="28" fontWeight="bold" fill={cutout} textAnchor="middle">
          1
        </SvgText>
      </>
    )}
    {name === 'bottle' && (
      <>
        <Rect x="27" y="6" width="10" height="9" rx="2" fill={color} />
        <Path
          d="M28 17h8v9c0 3 6 5 6 11v17a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V37c0-6 6-8 6-11z"
          fill={color}
        />
        <Rect x="26" y="38" width="12" height="12" rx="2" fill={cutout} />
      </>
    )}
    {name === 'ball' && (
      <>
        <Circle cx="32" cy="32" r="26" fill={color} />
        <Circle cx="32" cy="32" r="13" fill={cutout} />
        <SvgText x="32" y="39" fontSize="20" fontWeight="bold" fill={color} textAnchor="middle">
          8
        </SvgText>
      </>
    )}
    {name === 'matches' && (
      <>
        <Path d="M14 54L44 12" stroke={color} strokeWidth={5} strokeLinecap="round" />
        <Path d="M22 56L52 28" stroke={color} strokeWidth={5} strokeLinecap="round" />
        <Circle cx="46.5" cy="10" r="7" fill={color} />
        <Circle cx="55" cy="25.5" r="6" fill={color} />
      </>
    )}
    {name === 'dice' && (
      <>
        <Rect x="9" y="9" width="46" height="46" rx="11" fill={color} />
        <Circle cx="22" cy="22" r="4.5" fill={cutout} />
        <Circle cx="32" cy="32" r="4.5" fill={cutout} />
        <Circle cx="42" cy="42" r="4.5" fill={cutout} />
      </>
    )}
    {name === 'cards' && (
      <>
        <Rect x="8" y="10" width="30" height="42" rx="6" fill={color} opacity={0.55} transform="rotate(-14 23 31)" />
        <Rect x="24" y="8" width="30" height="42" rx="6" fill={color} transform="rotate(10 39 29)" />
        <Path d="M39 36c-5-4-6-6.5-6-8.500a3.2 3.2 0 0 1 6-1.500a3.2 3.2 0 0 1 6 1.500c0 2-1 4.5-6 8.500z" fill={cutout} transform="rotate(10 39 29)" />
      </>
    )}
    {name === 'teams' && (
      <>
        <Circle cx="21" cy="22" r="8" fill={color} />
        <Path d="M6 50c0-9 6-15 15-15s15 6 15 15z" fill={color} />
        <Circle cx="44" cy="25" r="8" fill={color} opacity={0.6} />
        <Path d="M32 50c0-8 5-13 12-13s14 5 14 13z" fill={color} opacity={0.6} />
      </>
    )}
  </Svg>
)
