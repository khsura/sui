import { type PropType } from 'vue'
import { propsTag } from './core'
import { propsBorder } from './core/borderProps'
import { propsMeasurableStyles } from './core/measurableStyles'
import { propsLayout } from './layoutProps'
import { propsPosition } from './positionProps'
import { propsScrollable } from './scrollableProps'
import { propsSingleGroup } from './singleGroupProps'

export const propsBottomNavigation = (
  { height = 56, activeClass = 's_textColor__primary' }: { height?: number; activeClass?: string } = {
    height: 56,
    activeClass: 's_textColor__primary',
  },
) => {
  return {
    activeClass: {
      type: String as PropType<string>,
      default: activeClass,
    },
    hideOnScroll: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    horizontal: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    inputValue: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    shift: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    dense: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    bordered: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    grow: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    ...propsTag(),
    ...propsLayout(),
    ...propsScrollable(),
    ...propsPosition(),
    ...propsMeasurableStyles({ height }),
    ...propsSingleGroup(),
    ...propsBorder(),
  }
}
