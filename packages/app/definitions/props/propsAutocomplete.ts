import type { PropsMenu } from './propsMenu'
import { type PropsSizePreset } from './propsSizePreset'
import type { SelectItem, AutocompleteModelType } from '@/app/types'

export type PropsAutocomplete<T extends boolean = false> = {
  // Model value
  modelValue?: AutocompleteModelType<T>

  // Label, as SSelect and SInput draw theirs
  /** @description A label above the field, tied to its input. */
  label?: string | null
  /** @description The input's id; one is generated when absent, so the label can point at it. */
  id?: string
  /** @description Hides the label, as `hideDetails` does on SSelect. */
  hideDetails?: boolean
  /** @description Accessible name when there is no visible `label`; a hidden label is used otherwise. */
  ariaLabel?: string | null
  /** @description Accessible name of the clear button. Defaults to `'Clear'`. */
  clearAriaLabel?: string
  /** @description Accessible name of the loading spinner. Defaults to `'Loading'`. */
  loadingAriaLabel?: string

  // Items and filtering
  items?: SelectItem[] | string[]
  filter?: (item: SelectItem, queryText: string) => boolean
  /** @description by default, the filter mode is 'contains' */
  filterMode?: 'start' | 'contains' | 'exact' | 'none' | undefined
  debounce?: number
  /** Message shown in the open menu when no item matches the query (and there is no "Add" option). Without it (and without the `noData` slot) the menu stays blank. Put an `SEmptyState` in the `noData` slot for an icon or an action. */
  noDataText?: string | undefined
  // noFilter?: boolean

  // Selection behavior
  multiple?: T
  chips?: boolean
  closableChips?: boolean
  dense?: boolean
  /**
   * @description When true, allows the user to add items that are not in the `items` list.
   * The typed text is used as both `text` and `value`. A `createItem` event is emitted
   * so the parent can react (e.g. persist to backend).
   */
  allowUnlisted?: boolean

  // Loading and async
  loading?: boolean

  // Display options
  clearable?: boolean
  divided?: boolean

  // Input behavior
  placeholder?: string
  name?: string
  delimiter?: string | string[] | RegExp
  /**
   * @description The native input's `autocomplete` attribute. Defaults to `'off'`: the
   * field draws its own menu, and the browser's form-history list would open on top of it.
   * Pass any token (`'on'`, `'name'`, …) to let the browser suggest again.
   */
  autocomplete?: string

  // Events
  onUpdateSearchInput?: (value: string) => void
} & PropsSizePreset &
  PropsMenu
