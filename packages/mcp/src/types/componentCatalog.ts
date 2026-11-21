import type { SuiApiComponent } from '@khsura/shared/types'

export interface ComponentSummary {
  name: string
  family: string
  purpose: string
}

export type ComponentLookup = { found: true; component: SuiApiComponent } | { found: false; suggestions: string[] }
