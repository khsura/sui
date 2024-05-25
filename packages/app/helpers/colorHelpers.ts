import { CssColor, cssColorToHex } from '@khsura/sui/constants'
import { z } from 'zod'

export const getCssColor = (color: string) => {
  const parsed = z.nativeEnum(CssColor).safeParse(color.toLowerCase())

  return parsed.success ? parsed.data : undefined
}

export const getCssColorHex = (color: string) => {
  const cssColor = getCssColor(color)

  return cssColor ? cssColorToHex[cssColor] : undefined
}
