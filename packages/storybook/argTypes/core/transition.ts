import { kTransitions } from '@khsura/sui'
import type { STransition } from '@khsura/sui/constants'
import kTransitionString from '@khsura/sui/constants/transition?raw'
import type { ArgTypes } from '@storybook/vue3'
import { extractInterfaceString } from '@khsura/storybook/helpers'

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
