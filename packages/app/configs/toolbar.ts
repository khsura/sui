import { ToolbarDensity } from '~/constants/toolbar'

export const toolbarDensities: Array<string | null | undefined> = [
  null,
  ToolbarDensity.default,
  ToolbarDensity.comfortable,
  ToolbarDensity.compact,
]

export const toolbarExtensionHeightSubractors = {
  [ToolbarDensity.default]: 0,
  [ToolbarDensity.comfortable]: 4,
  [ToolbarDensity.compact]: 8,
}

export const toolbarHeightSubractors = {
  [ToolbarDensity.default]: 0,
  [ToolbarDensity.comfortable]: 8,
  [ToolbarDensity.compact]: 16,
}
