import { type MaterialDesignIcon } from '@khsura/sui/types'
import { type PropType } from 'vue'
import { propsWindow } from './windowProps'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { mandatory, ...customPropsWindow } = propsWindow()

export const propsCarousel = () => {
  return {
    cycle: Boolean,
    delimiterIcon: {
      type: String as PropType<MaterialDesignIcon>,
      default: 'mdi-circle',
    },
    height: {
      type: [Number, String],
      default: 500,
    },
    controlsBackgroundColor: {
      type: String,
      default: '#0000004d',
    },
    hideDelimiters: Boolean,
    hideDelimiterBackground: Boolean,
    interval: {
      type: Number as PropType<number>,
      default: 6000,
      validator: (value: number) => value > 0,
    },
    // progress: [Boolean, String],
    verticalDelimiters: {
      type: [Boolean, String] as PropType<boolean | 'left' | 'right'>,
      default: false,
    },

    ...customPropsWindow,
  }
}
