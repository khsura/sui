import { faker } from '@khsura/shared'
import dayjs from 'dayjs'
import type { SBreadcrumbs } from '@khsura/sui/components'
import type { ComponentPropsAndSlots } from '@storybook/vue3'

export const argsBreadcrumbs = (
  params?: Partial<ComponentPropsAndSlots<typeof SBreadcrumbs>>,
): Partial<ComponentPropsAndSlots<typeof SBreadcrumbs>> => {
  return {
    items: [
      {
        text: 'Home',
        to: { name: 'index' },
      },
      {
        text: dayjs(faker.date.anytime()).format('YYYY-MM-DD'),
        to: { name: 'races-date' },
      },
      {
        text: faker.commerce.department(),
        to: { name: 'races-date-racecourse' },
      },
      {
        text: faker.commerce.product(),
        to: { name: 'races-date-racecourse-raceNumber' },
      },
    ],
    color: 'info',
    large: false,
    ...params,
  }
}
