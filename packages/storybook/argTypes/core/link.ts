import type { PropsLink } from '@sui/app/definitions'
import type { ArgTypes } from '@storybook/types'

export const argTypesLink: ArgTypes<PropsLink> = {
  href: {
    control: 'text',
    description: "anchor tag's href",
    table: {
      type: {
        summary: 'string | null',
      },
      defaultValue: {
        summary: 'null',
      },
    },
  },
  to: {
    description: "vue route's location",
    table: {
      type: {
        summary: 'RouteLocation | null',
      },
      defaultValue: {
        summary: 'null',
      },
    },
  },
}
