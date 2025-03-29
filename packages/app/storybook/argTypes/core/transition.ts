import type { ArgTypes } from '@storybook/vue3'
import type { STransition } from '~/constants'
import kTransitionString from '~/constants/transition?raw'
import { kTransitions } from '~/index'
import { extractInterfaceString } from '~/storybook/helpers'

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
