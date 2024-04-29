import { type PresetColor } from '@sui/app/constants'
import { type PropType } from 'vue'
import { propsColor } from './core'
import { propsFormInput } from './formInputProps'

export const propsCheckbox = () => {
  const { color } = propsColor<PresetColor>()

  return {
    label: {
      type: String,
      default: '',
    },
    block: {
      type: Boolean,
      default: false,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<'default' | 'large'>,
      default: 'default',
    },
    color,
    ...propsFormInput<boolean>(),
  } as const
}
