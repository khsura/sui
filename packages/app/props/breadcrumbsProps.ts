import { type PropType } from 'vue'
import { type BreadcrumbsItem } from '~/types'

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
