import type { SuiApiComponent } from '@khsura/shared/types'
import { DEFAULT_FAMILY_PURPOSE, FAMILY_PURPOSES } from '../constants'
import { humanizeComponentName } from './componentName'

const familyPurpose = (family: string): string =>
  Object.entries(FAMILY_PURPOSES).find(([familyName]) => familyName === family)?.[1] ?? DEFAULT_FAMILY_PURPOSE

/**
 * One-line purpose. sui-api.json carries no component-level description yet,
 * so it is derived from the component name and its family.
 */
export const componentPurpose = (component: Pick<SuiApiComponent, 'name' | 'family'>): string =>
  `${humanizeComponentName(component.name)} — ${familyPurpose(component.family)}`
