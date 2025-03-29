import type { ArgTypes } from '@storybook/vue3'
import type { PropsLink } from '~/index'

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
