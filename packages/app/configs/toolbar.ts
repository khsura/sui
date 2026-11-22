import { Density } from '@/app/constants'

/** @deprecated Use `densities` — SToolbar uses the global density scale. */
export const toolbarDensities: Array<string | null | undefined> = [
  null,
  Density.default,
  Density.comfortable,
  Density.compact,
]

export const toolbarExtensionHeightSubractors = {
  [Density.default]: 0,
  [Density.comfortable]: 4,
  [Density.compact]: 8,
}

export const toolbarHeightSubractors = {
  [Density.default]: 0,
  [Density.comfortable]: 8,
  [Density.compact]: 16,
}
