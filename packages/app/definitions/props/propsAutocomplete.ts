import type { PropsMenu } from './propsMenu'
import { type PropsSizePreset } from './propsSizePreset'
import type { SelectItem, AutocompleteModelType } from '@/app/types'

export type PropsAutocomplete<T extends boolean = false> = {
  // Model value
  modelValue?: AutocompleteModelType<T>

  // Items and filtering
  items?: SelectItem[] | string[]
  filter?: (item: SelectItem, queryText: string) => boolean
  /** @description by default, the filter mode is 'contains' */
  filterMode?: 'start' | 'contains' | 'exact' | 'none' | undefined
  debounce?: number
  // noDataText?: string
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
  autocomplete?: 'on' | 'off' | undefined

  // Events
  onUpdateSearchInput?: (value: string) => void
} & PropsSizePreset &
  PropsMenu
