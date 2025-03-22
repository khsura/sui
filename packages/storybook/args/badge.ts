import type { SBadge } from '@khsura/sui'
import { STransition } from '@khsura/sui'
import type { ComponentPropsAndSlots } from '@storybook/vue3'

export const argsBadge: Partial<ComponentPropsAndSlots<typeof SBadge>> = {
  bottom: false,
  color: '#c2a000',
  colorThreshold: 60,
  content: 6,
  dot: false,
  inline: false,
  label: 'badge',
  left: false,
  overlap: false,
  tile: false,
  transitionName: STransition.bounce,
  value: true,
  // offsetX: null,
  // offsetY: null,
  // icon: null,
}
