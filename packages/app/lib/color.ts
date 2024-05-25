import { getCssColor } from '@khsura/sui/helpers/colorHelpers'
import { colorThreshold } from '@khsura/sui/constants'

export const hexToRgb = (hex: string) => {
  if (!/^#(([0-9a-fA-F]{3,4})|([0-9a-fA-F]{6})|([0-9a-fA-F]{8}))$/.test(hex)) {
    return null
  }

  const hexValue = hex.toUpperCase().slice(1)

  if (hexValue.length === 3 || hexValue.length === 4) {
    return {
      r: parseInt(`0x${hexValue.slice(0, 1)}`, 16),
      g: parseInt(`0x${hexValue.slice(1, 2)}`, 16),
      b: parseInt(`0x${hexValue.slice(2, 3)}`, 16),
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
    const cssColor = getCssColor(rgb)

    if (cssColor !== undefined) {
      return hexToRgb(cssColor)
    }

    return hexToRgb(rgb)
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

export const isDarkColor = (
  rgb: string | [number, number, number] | { r: number; g: number; b: number } | null | undefined,
  threshold = colorThreshold,
) => {
  if (!rgb) {
    return null
  }

  const color = convertToRgb(rgb)

  if (color) {
    const sum = Math.round((color.r * 299 + color.g * 587 + color.b * 114) / 1000)

    return sum <= (threshold / 100) * 255
  }

  return null
}
