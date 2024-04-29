import { type PropType } from 'vue'
import {
  propsBorder,
  propsColor,
  propsDisabled,
  propsElevation,
  propsMeasurableStyles,
  propsTag,
  propsVariant,
} from './core'
import { propsLink } from './linkProps'
import { propsSingleGroupItem } from './singleGroupItemProps'
import { propsSizePreset } from './sizeProps'

export const propsButton = () => {
  return {
    type: {
      type: String as PropType<'button' | 'reset' | 'submit'>,
      default: 'button',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    ...propsTag<'button' | 'a'>({ tag: 'button' }),
    ...propsVariant(),
    ...propsMeasurableStyles(),
    ...propsElevation(),
    ...propsColor(),
    ...propsSizePreset(),
    ...propsLink(),
    ...propsBorder(),
    ...propsDisabled(),
    ...propsSingleGroupItem(),
  }
}
