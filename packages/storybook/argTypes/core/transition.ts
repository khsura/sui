import { kTransitions } from '@khsura/sui/configs'
import kTransitionString from '@khsura/sui/constants/transition?raw'
import { extractInterfaceString } from '@khsura/storybook/helpers'
import type { STransition } from '@khsura/sui/constants'
import type { ArgTypes } from '@storybook/vue3'

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
