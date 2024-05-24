import { type ComponentPropsOptions } from 'vue'
import { propsToolbar } from './toolbarProps'
import { propsLayout } from './layoutProps'
import { propsScrollable } from './scrollableProps'
import { propsPosition } from './positionProps'

export const propsAppBar = () => {
  return {
    elevateOnScroll: {
      type: Boolean,
      default: false,
    },
    hideOnScroll: {
      type: Boolean,
      default: false,
    },
    ...propsToolbar({ tag: 'header' }),
    ...propsLayout({ app: false }),
    ...propsScrollable(),
    ...propsPosition(),
  } satisfies ComponentPropsOptions
}
