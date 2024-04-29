import { formInputModelValueRules } from '@sui/app/repositories'
import type { PropsSelect } from '@sui/app/definitions'
import { argsBorder, argsColor, argsDisabled } from './core'

export const argsSelect: Omit<PropsSelect, 'modelValue' | 'error' | 'dirty' | 'activator'> = {
  ...argsBorder,
  ...argsColor,
  ...argsDisabled,
  closeOnClick: false,
  closeOnContentClick: false,
  closeOnScroll: false,
  grow: false,
  hideDetails: false,
  id: 'select',
  label: 'Countries',
  location: null,
  menu: null,
  name: 'select',
  offsetX: 0,
  offsetY: 0,
  rules: [formInputModelValueRules.select({ target: 'Country' })],
  items: [
    { text: 'Bangladesh', value: '01' },
    { text: 'China', value: '02' },
    { text: 'India', value: '03' },
    { text: 'Japan', value: '04' },
    { text: 'Korea', value: '05' },
    { text: 'Mongolia', value: '06' },
    { text: 'Pakistan', value: '07' },
    { text: 'Russia', value: '08' },
    { text: 'United Kingdom', value: '09' },
    { text: 'United States', value: '10' },
  ],
  dense: false,
  text: false,
}
