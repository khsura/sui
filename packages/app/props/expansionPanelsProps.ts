import { type MaterialDesignIcon, type SizePropertyType } from '@sui/app/types'
import { type PropType } from 'vue'
import { propsGroup } from './core/groupProps'

export const propsExpansionPanels = () => {
  return {
    ...propsGroup<number>(),
    expandIcon: {
      type: String as PropType<MaterialDesignIcon>,
      default: 'mdi-chevron-down',
    },
    expandIconSize: {
      type: String as PropType<SizePropertyType>,
      default: null,
    },
  }
}
