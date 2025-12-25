import type { SelectItem } from '@/app/types'

export const getItemText = <T extends SelectItem | string | undefined | null = SelectItem | string | undefined | null>(
  item: T,
) => {
  if (typeof item === 'string' || item === undefined || item === null) {
    return item as string | undefined | null
  }

  return item.text
}

export const getItemValue = <T extends SelectItem | string | undefined | null = SelectItem | string | undefined | null>(
  item: T,
) => {
  if (typeof item === 'string' || item === undefined || item === null) {
    return item as string | undefined | null
  }

  return item.value
}

export const getSelectItem = <
  T extends SelectItem | string | undefined | null = SelectItem | string | undefined | null,
>(
  item: T,
): SelectItem => {
  if (typeof item === 'string' || item === undefined || item === null) {
    return {
      text: item ?? '',
      value: item,
    }
  }

  return item
}
