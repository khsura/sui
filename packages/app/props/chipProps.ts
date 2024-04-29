import { propsBorder, propsColor, propsDisabled } from './core'
import { propsSizePreset } from './sizeProps'

export const propsChip = () => {
  return {
    ...propsColor(),
    ...propsDisabled(),
    ...propsBorder(),
    ...propsSizePreset(),
    label: {
      type: Boolean,
      default: false,
    },
    closable: {
      type: Boolean,
      default: false,
    },
    link: {
      type: Boolean,
      default: false,
    },
  } as const
}
