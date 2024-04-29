import { type PropType } from 'vue'
import { propsColor, propsMeasurableStyles } from './core'
import { propsMenu } from './menuProps'

export const propsTooltip = () => {
  return {
    opacity: {
      type: [String, Number] as PropType<number | string>,
      default: 1,
    },
    ...propsMeasurableStyles(),
    ...propsMenu({ location: 'bottom' }),
    ...propsColor(),
  }
}
