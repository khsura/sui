export type AutocompleteModelTypeBase = string | null | undefined | number

export type AutocompleteModelType<T extends boolean = boolean> = T extends true
  ? AutocompleteModelTypeBase[]
  : AutocompleteModelTypeBase

import type { SelectItem } from './select'

export type AutocompleteEmitEvents = {
  searchItem: [string]
  createItem: [SelectItem]
}
