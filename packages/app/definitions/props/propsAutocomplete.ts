import type { SelectItem } from '@khsura/sui/types'
import type { PropsMenu } from '@khsura/sui/definitions/props/propsMenu'
import type { AutocompleteModelType } from '@khsura/sui/types/autocomplete'
import { type PropsSizePreset } from './propsSizePreset'

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
