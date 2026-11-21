import {
  contrastFlare,
  darkestTextColor,
  lightestTextColor,
  luminanceWeightBlue,
  luminanceWeightGreen,
  luminanceWeightRed,
  srgbChannelMax,
  srgbGamma,
  srgbGammaDivisor,
  srgbGammaOffset,
  srgbLinearDivisor,
  srgbLinearThreshold,
} from '@/app/constants'
import { getCssColorHex } from '@/app/helpers/colorHelpers'

export const hexToRgb = (hex: string) => {
  if (!/^#(([0-9a-fA-F]{3,4})|([0-9a-fA-F]{6})|([0-9a-fA-F]{8}))$/.test(hex)) {
    return null
  }

  const hexValue = hex.toUpperCase().slice(1)

  if (hexValue.length === 3 || hexValue.length === 4) {
    // shorthand digits repeat: #f80 is #ff8800
    return {
      r: parseInt(hexValue.slice(0, 1).repeat(2), 16),
      g: parseInt(hexValue.slice(1, 2).repeat(2), 16),
      b: parseInt(hexValue.slice(2, 3).repeat(2), 16),
    }
  }

  if (hexValue.length === 6 || hexValue.length === 8) {
    return {
      r: parseInt(`0x${hexValue.slice(0, 2)}`, 16),
      g: parseInt(`0x${hexValue.slice(2, 4)}`, 16),
      b: parseInt(`0x${hexValue.slice(4, 6)}`, 16),
    }
  }

  return null
}

export const convertToRgb = (rgb: string | [number, number, number] | { r: number; g: number; b: number }) => {
  if (typeof rgb === 'string') {
    // CSS colour names (`navy`, `white`) resolve to their hex value first
    return hexToRgb(getCssColorHex(rgb) ?? rgb)
  }

  if (rgb instanceof Array) {
    return {
      r: rgb[0],
      g: rgb[1],
      b: rgb[2],
    }
  }

  return { ...rgb }
}

type RgbInput = string | [number, number, number] | { r: number; g: number; b: number }

const linearizeChannel = (channel: number) => {
  const value = channel / srgbChannelMax

  return value <= srgbLinearThreshold
    ? value / srgbLinearDivisor
    : Math.pow((value + srgbGammaOffset) / srgbGammaDivisor, srgbGamma)
}

// WCAG 2.x relative luminance (0 = black, 1 = white), or null when the colour cannot be parsed.
export const getRelativeLuminance = (rgb: RgbInput) => {
  const color = convertToRgb(rgb)

  if (!color) {
    return null
  }

  return (
    luminanceWeightRed * linearizeChannel(color.r) +
    luminanceWeightGreen * linearizeChannel(color.g) +
    luminanceWeightBlue * linearizeChannel(color.b)
  )
}

// WCAG 2.x contrast ratio between two colours (1 to 21), or null when either cannot be parsed.
export const getContrastRatio = (first: RgbInput, second: RgbInput) => {
  const firstLuminance = getRelativeLuminance(first)
  const secondLuminance = getRelativeLuminance(second)

  if (firstLuminance === null || secondLuminance === null) {
    return null
  }

  const lighter = Math.max(firstLuminance, secondLuminance)
  const darker = Math.min(firstLuminance, secondLuminance)

  return (lighter + contrastFlare) / (darker + contrastFlare)
}

// Picks whichever of the two text colours contrasts more with `background` (light text wins a tie).
export const getReadableTextColor = <T extends string>(background: RgbInput, lightText: T, darkText: T): T => {
  const lightContrast = getContrastRatio(background, lightText) ?? 0
  const darkContrast = getContrastRatio(background, darkText) ?? 0

  return lightContrast >= darkContrast ? lightText : darkText
}

/**
 * Whether `rgb` is dark enough to need light text.
 * Without `threshold` it compares WCAG contrast: light text is chosen when it contrasts more than dark text.
 * With an explicit `threshold` (0-100) it keeps the legacy YIQ brightness rule, so existing overrides behave the same.
 */
export const isDarkColor = (rgb: RgbInput | null | undefined, threshold?: number) => {
  if (!rgb) {
    return null
  }

  const color = convertToRgb(rgb)

  if (!color) {
    return null
  }

  if (threshold === undefined) {
    return getReadableTextColor(color, lightestTextColor, darkestTextColor) === lightestTextColor
  }

  const sum = Math.round((color.r * 299 + color.g * 587 + color.b * 114) / 1000)

  return sum <= (threshold / 100) * srgbChannelMax
}
