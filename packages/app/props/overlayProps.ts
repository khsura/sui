
import { PropType } from 'vue'
import { propsPosition } from './positionProps'
import { STransition } from '@sui/app/constants'

export const propsOverlay = () => {
  return {
    zIndex: {
      type: Number,
      default: 1000,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    scrim: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean as PropType<boolean | undefined | null>,
      default: false,
    },
    transition: {
      type: String,
      default: STransition.appear,
    },
    ...propsPosition(),
  }
}
