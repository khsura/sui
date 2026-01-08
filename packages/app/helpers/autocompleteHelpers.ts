import { type AutocompleteModelTypeBase } from '../types/autocomplete'
import type { SelectItem } from '@/app/types'
import type { AutocompleteModelType } from '@/app/types/autocomplete'

export const isDelimiter = (event: KeyboardEvent, delimiter: string | string[] | RegExp = ',') => {
  if (typeof delimiter === 'string') {
    return event.key === delimiter
  }

  if (delimiter instanceof RegExp) {
    return delimiter.test(event.key)
  }

  if (delimiter.includes(event.key)) {
    return true
  }

  return false
}

export const getItemFromText = (
  items: SelectItem[] | string[] | undefined,
  inputText: string | number | undefined | null,
) => {
  const foundItem = (items ?? []).find((i) => {
    const itemText = typeof i === 'string' ? i : i.text

    return itemText === inputText
  })

  if (typeof foundItem === 'string') {
    return {
      text: foundItem,
      value: foundItem,
    }
  }

  return foundItem
}

export const getItemFromValue = (
  items: SelectItem[] | string[] | undefined,
  inputValue: string | number | undefined | null,
) => {
  const foundItem = (items ?? []).find((i) => {
    const itemValue = typeof i === 'string' ? i : i.value

    return itemValue === inputValue
  })

  if (typeof foundItem === 'string') {
    return {
      text: foundItem,
      value: foundItem,
    }
  }

  return foundItem
}

export const getSafeTypeModelValue = <V extends boolean = boolean>(
  multiple: V | boolean | undefined,
  newModelValue: AutocompleteModelType<V> | AutocompleteModelTypeBase | AutocompleteModelTypeBase[],
): AutocompleteModelType<V> => {
  if (multiple) {
    return newModelValue as unknown as AutocompleteModelType<V>
  }

  return newModelValue as unknown as AutocompleteModelType<V>
}
