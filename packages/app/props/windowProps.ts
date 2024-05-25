import { type MaterialDesignIcon, type TouchHandlers } from '@khsura/sui/types'
import { type PropType } from 'vue'
import { propsColor, propsDisabled, propsTag } from './core'
import { propsSingleGroup } from './singleGroupProps'

export const propsWindow = () => {
  return {
    nextIcon: {
      type: [Boolean, String, Function, Object] as PropType<MaterialDesignIcon>,
      default: 'mdi-chevron-right',
    },
    prevIcon: {
      type: [Boolean, String, Function, Object] as PropType<MaterialDesignIcon>,
      default: 'mdi-chevron-left',
    },
    hideArrows: {
      type: Boolean as PropType<boolean | undefined>,
      default: false,
    },
    touch: {
      type: [Object, Boolean] as PropType<boolean | TouchHandlers | undefined>,
      default: undefined,
    },
    noAnimation: {
      type: Boolean as PropType<boolean | undefined>,
      default: false,
    },
    selectedClass: {
      type: String as PropType<string>,
      default: 's_windowItem--active',
    },
    ...propsDisabled(),
    ...propsSingleGroup(),
    ...propsTag(),
    ...propsColor(),
  }
}
