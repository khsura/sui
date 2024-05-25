import { type SelectItem } from '@khsura/sui/types'
import { type PropType } from 'vue'
import { propsBorder, propsColor, propsContent } from './core'
import { propsFormInput } from './formInputProps'
import { propsMenu } from './menuProps'

export const propsSelect = () => {
  return {
    name: {
      type: String,
      default: null,
    },
    items: {
      type: Array as PropType<Array<SelectItem | string>>,
      default: () => [],
    },
    label: {
      type: String,
      default: null,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    grow: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
    ...propsBorder(),
    ...propsMenu(),
    ...propsFormInput<string | number>(),
    ...propsContent(),
    ...propsColor(),
  } as const
}
