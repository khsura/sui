import {
  CONTRAST_FLARE,
  HEX_COLOR_PATTERN,
  HEX_RADIX,
  LUMINANCE_WEIGHT_BLUE,
  LUMINANCE_WEIGHT_GREEN,
  LUMINANCE_WEIGHT_RED,
  SHORT_HEX_LENGTH,
  SRGB_CHANNEL_MAX,
  SRGB_GAMMA,
  SRGB_GAMMA_DIVISOR,
  SRGB_GAMMA_OFFSET,
  SRGB_LINEAR_DIVISOR,
  SRGB_LINEAR_THRESHOLD,
} from '../constants'

/** `#rgb` / `#rrggbb` as `[r, g, b]` (0-255), or `undefined` for anything else (named colours, `rgb()`, bindings). */
export const parseHexColor = (color: string): [number, number, number] | undefined => {
  const match = HEX_COLOR_PATTERN.exec(color.trim())

  if (!match) {
    return undefined
  }

  const digits =
    match[1].length === SHORT_HEX_LENGTH
      ? [...match[1]].map((digit) => digit + digit)
      : [match[1].slice(0, 2), match[1].slice(2, 4), match[1].slice(4, 6)]

  const [red, green, blue] = digits.map((pair) => Number.parseInt(pair, HEX_RADIX))

  return [red, green, blue]
}

const linearizeChannel = (channel: number): number => {
  const ratio = channel / SRGB_CHANNEL_MAX

  return ratio <= SRGB_LINEAR_THRESHOLD
    ? ratio / SRGB_LINEAR_DIVISOR
    : ((ratio + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_DIVISOR) ** SRGB_GAMMA
}

const relativeLuminance = ([red, green, blue]: [number, number, number]): number =>
  LUMINANCE_WEIGHT_RED * linearizeChannel(red) +
  LUMINANCE_WEIGHT_GREEN * linearizeChannel(green) +
  LUMINANCE_WEIGHT_BLUE * linearizeChannel(blue)

/** WCAG 2.x contrast ratio (1 to 21) between two hex colours, or `undefined` when either is not `#rgb`/`#rrggbb`. */
export const getHexContrastRatio = (first: string, second: string): number | undefined => {
  const firstRgb = parseHexColor(first)
  const secondRgb = parseHexColor(second)

  if (!firstRgb || !secondRgb) {
    return undefined
  }

  const firstLuminance = relativeLuminance(firstRgb)
  const secondLuminance = relativeLuminance(secondRgb)

  return (
    (Math.max(firstLuminance, secondLuminance) + CONTRAST_FLARE) /
    (Math.min(firstLuminance, secondLuminance) + CONTRAST_FLARE)
  )
}
