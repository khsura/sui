import type { ArgTypes } from '@storybook/vue3'
import type { STransition } from '@/app/constants'
import kTransitionString from '@/app/constants/transition?raw'
import { kTransitions } from '@/app/index'
import { extractInterfaceString } from '@/app/storybook/helpers'

export const argTypesTransition: ArgTypes<{ transition: STransition }> = {
  transition: {
    control: {
      type: 'select',
    },
    options: [null, ...kTransitions],
    table: {
      defaultValue: {
        summary: 'null',
      },
      type: {
        summary: 'STransition | null',
        detail: extractInterfaceString(kTransitionString, 'STransition'),
      },
    },
  },
}
