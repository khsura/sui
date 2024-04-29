import { type BreadcrumbsItem } from '@sui/app/types'

import { type PropType } from 'vue'
import { propsTextColor } from './core'

export const propsBreadcrumbs = () => {
  return {
    items: {
      type: Array as PropType<BreadcrumbsItem[]>,
      default: () => [],
    },
    divider: {
      type: String as PropType<string>,
      default: '/',
    },
    large: {
      type: Boolean,
      default: false,
    },
    ...propsTextColor(),
  } as const
}
