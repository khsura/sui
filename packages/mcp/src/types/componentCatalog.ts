import type { SuiApiComponent } from '@khsura/shared/types'

export interface ComponentSummary {
  name: string
  family: string
  purpose: string
}

/** A name from another UI library mapped to its SUI equivalent. */
export interface ComponentAliasMatch {
  /** The alias as written in the alias map (`SCol`, `STextField`, …). */
  alias: string
  /** The SUI components to use instead, all present in the resolved API; empty when SUI has no equivalent yet. */
  suiNames: string[]
  hint: string
}

export type ComponentLookup =
  { found: true; component: SuiApiComponent } | { found: false; suggestions: string[]; alias?: ComponentAliasMatch }
