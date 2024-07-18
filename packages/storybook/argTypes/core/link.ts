import type { PropsLink } from '@khsura/sui/definitions'
import type { ArgTypes } from '@storybook/vue3'

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
