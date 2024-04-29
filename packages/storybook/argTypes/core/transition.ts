import { kTransitions } from '@sui/app/configs'
import kTransitionString from '@sui/app/constants/transition?raw'
import { extractInterfaceString } from '@sui/storybook/helpers'
import type { STransition } from '@sui/app/constants'
import type { ArgTypes } from '@storybook/types'

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
