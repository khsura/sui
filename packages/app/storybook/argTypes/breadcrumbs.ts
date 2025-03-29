import type { ArgTypes, ComponentPropsAndSlots } from '@storybook/vue3'
import type { SBreadcrumbs } from '~/components'
import { extractInterfaceString } from '~/storybook/helpers'
import breadcrumbsItem from '~/types/breadcrumbs?raw'
import { argTypesTextColor } from './core'

export const argTypesBreadcrumbs: Partial<ArgTypes<ComponentPropsAndSlots<typeof SBreadcrumbs>>> = {
  items: {
    table: {
      defaultValue: {
        summary: '[]',
      },
      type: {
        summary: `BreadcrumbsItem[]`,
        detail: extractInterfaceString(breadcrumbsItem, 'BreadcrumbsItem'),
      },
    },
  },
  divider: {
    type: 'string',
    control: {
      type: 'text',
    },
    description: 'will be ignored if custom divider slot is set',
    table: {
      defaultValue: {
        summary: '/',
      },
      type: {
        summary: 'string | null | undefined',
      },
    },
  },
  large: {
    description: 'makes font size larger',
    table: {
      defaultValue: {
        summary: 'false',
      },
      type: {
        summary: 'boolean | null | undefined',
      },
    },
  },
  ...argTypesTextColor({ color: { description: 'changes link color' } }),
  'custom-divider': {
    table: {
      defaultValue: {
        summary: 'undefined',
      },
      type: {
        summary: 'HTMLElement | VNode',
      },
    },
  },
}
