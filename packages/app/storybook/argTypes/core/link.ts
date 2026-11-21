import type { ArgTypes } from '@storybook/vue3'
import type { PropsLink } from '@/app/index'

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
    description:
      'Internal route (string path or location object). Renders a router-link when the app uses vue-router, otherwise a plain <a href>',
    table: {
      type: {
        summary: 'LinkLocation | null',
      },
      defaultValue: {
        summary: 'null',
      },
    },
  },
}
