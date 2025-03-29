import { faker } from '@khsura/shared'
import { action } from '@storybook/addon-actions'
import type { ComponentPropsAndSlots } from '@storybook/vue3'
import type { SButton } from '~/index'
import { argsBorder, argsColor, argsDisabled, argsSlot } from './core'

export const argsButton = (
  params?: Partial<ComponentPropsAndSlots<typeof SButton>>,
): Partial<ComponentPropsAndSlots<typeof SButton>> => {
  return {
    ...argsBorder,
    ...argsColor,
    ...argsDisabled,
    ...argsSlot(faker.word.verb()),
    block: false,
    color: 'primary',
    elevation: '',
    height: '',
    href: null as string | null,
    loading: false,
    maxHeight: '',
    maxWidth: '',
    minHeight: '',
    minWidth: '',
    onClick: action('clicked'),
    size: null,
    to: null,
    type: 'button',
    variant: null,
    width: '',
    ...params,
  }
}
