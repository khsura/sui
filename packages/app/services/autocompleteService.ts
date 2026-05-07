import { computed, nextTick, ref, type ComponentPublicInstance, type EmitFn, type Ref, type ShallowRef } from 'vue'
import {
  isDelimiter,
  getItemFromText,
  getSafeTypeModelValue,
  getItemFromValue,
  getItemText,
  getSelectItem,
  getItemValue,
} from '../helpers'
import { useMenuService } from '../services/menuService'
import { merge } from '@/app/vendors/merge'
import type { AutocompleteEmitEvents, AutocompleteModelType, AutocompleteModelTypeBase } from '@/app/types/autocomplete'
import type { PropsAutocomplete } from '@/app/definitions'
import type { SelectItem } from '@/app/types'

export const useAutocompleteService = <T extends boolean = false>(
  props: PropsAutocomplete<T>,
  model: Ref<AutocompleteModelType<T> | null | undefined>,
  emit: EmitFn<AutocompleteEmitEvents>,
  templateRefs: {
    activatorElement: ShallowRef<HTMLElement | null>
    contentElement: ShallowRef<HTMLElement | ComponentPublicInstance | null>
    inputElement: Ref<HTMLElement | null>
  },
) => {
  const queryText = ref('')
  const isFocused = ref(false)
  const isMenuOpen = ref(false)
  let debounceTimeout: NodeJS.Timeout | number | null = null
  const itemsPool = ref<Record<string, SelectItem | undefined>>({})

  const isMultiple = computed<boolean>(() => {
    if (props.multiple === undefined || props.multiple === false) {
      return false
    }

    return true
  })

  const { contentClasses, contentStyles, updateLocation } = useMenuService(
    props,
    isMenuOpen,
    {
      activatorElement: templateRefs.activatorElement,
      contentElement: templateRefs.contentElement,
    },
    { autoFlip: true },
  )

  const getChangeModelValueType = <V extends boolean = boolean>(
    multiple?: V,
  ): AutocompleteModelType<T> | undefined | null => {
    let returnValue: AutocompleteModelType<T> | null | undefined = undefined
    const value = model.value

    if (multiple) {
      if (!Array.isArray(value)) {
        if (typeof value === 'number') {
          returnValue = getSafeTypeModelValue<T>(true, [value])
        } else {
          returnValue = getSafeTypeModelValue<T>(
            true,
            value !== undefined && value !== null && value.trim() !== '' ? [value.trim()] : [],
          )
        }
      } else {
        returnValue = value
      }
    } else if (!multiple) {
      if (Array.isArray(value)) {
        returnValue = getSafeTypeModelValue<T>(false, value[-1])
      } else {
        returnValue = getSafeTypeModelValue<T>(false, value)
      }
    }

    return returnValue as unknown as AutocompleteModelType<T> | undefined | null
  }

  const addItemToModel = (type: 'text' | 'value', inputText?: AutocompleteModelTypeBase) => {
    let foundItem =
      type === 'text' ? getItemFromText(props.items ?? [], inputText) : getItemFromValue(props.items ?? [], inputText)

    if (
      !foundItem &&
      props.allowUnlisted &&
      type === 'text' &&
      typeof inputText === 'string' &&
      inputText.trim() !== ''
    ) {
      const trimmed = inputText.trim()
      const existing = getItemFromItemsPool(trimmed)

      if (existing) {
        foundItem = existing
      } else {
        const newItem: SelectItem = { text: trimmed, value: trimmed }

        updateItemsPool([newItem])
        emit('createItem', newItem)
        foundItem = newItem
      }
    }

    if (!foundItem) {
      if (isMultiple.value) {
        queryText.value = ''
      } else {
        model.value = undefined
        queryText.value = ''
      }

      return
    }

    if (isMultiple.value) {
      const val = getSafeTypeModelValue<true>(isMultiple.value, getChangeModelValueType(isMultiple.value))

      if (val?.includes(foundItem.value)) {
        model.value = getSafeTypeModelValue<T>(isMultiple.value, val.filter((item) => item !== foundItem.value) ?? [])
      } else {
        model.value = getSafeTypeModelValue<T>(isMultiple.value, [...(val ?? []), foundItem.value])
      }

      queryText.value = ''
    } else {
      const val = getChangeModelValueType(isMultiple.value)

      if (val === foundItem.value && !isMultiple.value) {
        queryText.value = foundItem.text

        return
      }

      const newValue = foundItem.value !== val ? foundItem.value : undefined

      model.value = getSafeTypeModelValue<T>(isMultiple.value, newValue)

      queryText.value = props.chips ? '' : foundItem.text
    }
  }

  const onBlur = (hideMenu?: boolean) => {
    isFocused.value = false
    if (queryText.value.trim()) {
      addItemToModel('text', queryText.value.trim())
    }

    if (hideMenu) {
      isMenuOpen.value = false
    }
  }

  const onFocus = async () => {
    isFocused.value = true
    isMenuOpen.value = true
    await nextTick()
    updateLocation()
  }

  const onEnter = () => {
    if (queryText.value.trim()) {
      addItemToModel('text', queryText.value.trim())
    }

    queryText.value = ''
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (isDelimiter(event)) {
      onEnter()
      event.preventDefault()
    }

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    debounceTimeout = setTimeout(() => {
      emit('searchItem', queryText.value)
    }, props.debounce)
  }

  const removeInput = async (value: AutocompleteModelTypeBase) => {
    if (isMultiple.value) {
      const val = getSafeTypeModelValue<true>(isMultiple.value, getChangeModelValueType<true>(isMultiple.value))

      model.value = getSafeTypeModelValue<T>(isMultiple.value, val.filter((item) => item !== value) ?? [])
    } else {
      const val = getChangeModelValueType(isMultiple.value)

      if (val === value) {
        model.value = undefined
      }
    }

    await nextTick()
    updateLocation()
  }

  const onBackspace = () => {
    if (queryText.value.trim() === '') {
      void removeInput(Array.isArray(model.value) ? model.value[model.value.length - 1] : model.value)
    }
  }

  const onClickOutside = (event: Event) => {
    const target = (event.target ?? event.currentTarget) as HTMLElement

    if (target.contains(templateRefs.inputElement.value)) {
      return
    }

    isMenuOpen.value = false
  }

  const onSelectItem = async (item: SelectItem | string) => {
    if (typeof item === 'string') {
      addItemToModel('value', item)
    } else {
      addItemToModel('value', item.value)
    }

    if (!isMultiple.value) {
      isMenuOpen.value = false
    }

    await nextTick()
    updateLocation()
  }

  const onSelectUnlisted = async () => {
    const trimmed = queryText.value.trim()

    if (!trimmed) return

    addItemToModel('text', trimmed)

    if (!isMultiple.value) {
      isMenuOpen.value = false
    }

    await nextTick()
    updateLocation()
  }

  const showCreateOption = computed(() => {
    if (!props.allowUnlisted) return false

    const trimmed = queryText.value.trim()

    if (trimmed === '') return false

    return !(props.items ?? []).some((item) => getItemText(item) === trimmed)
  })

  const filteredItems = computed(() => {
    return (
      props.items?.filter((item) => {
        const itemText = getItemText(item)
        const queryTextValue = queryText.value.toLowerCase().trim()

        if (queryTextValue === '' || props.filterMode === 'none') {
          return true
        }

        if (props.filter) {
          return props.filter(getSelectItem(item), queryText.value)
        }

        if (props.filterMode === 'start') {
          return itemText?.toLowerCase().startsWith(queryTextValue) ?? false
        }

        if (props.filterMode === 'exact') {
          return itemText?.toLowerCase() === queryTextValue
        }

        return itemText?.toLowerCase().includes(queryTextValue) ?? false
      }) ?? []
    )
  })

  const getIsSelected = (item: SelectItem | string) => {
    if (typeof model.value === 'string' || typeof model.value === 'number') {
      return item === model.value
    }

    return model.value?.includes(typeof item === 'string' ? item : item.value)
  }

  const updateModelType = (multiple: boolean) => {
    model.value = getChangeModelValueType(multiple)

    if (multiple) {
      queryText.value = ''
    } else {
      queryText.value = props.chips
        ? ''
        : (getItemText(props.items?.find((item) => getItemValue(item) === model.value) ?? '') ?? '')
    }
  }

  const clear = () => {
    model.value = getSafeTypeModelValue<T>(isMultiple.value, isMultiple.value ? [] : undefined)
    queryText.value = ''
  }

  const updateItemsPool = (items: SelectItem[] | string[]) => {
    itemsPool.value = merge(
      itemsPool.value,
      items.reduce(
        (acc, item) => {
          const selectItem = getSelectItem(item)

          acc[JSON.stringify(selectItem.value)] = {
            ...selectItem,
          }

          return acc
        },
        {} as Record<string, SelectItem>,
      ),
    )
  }

  const getItemFromItemsPool = (value: AutocompleteModelTypeBase) => {
    return itemsPool.value[JSON.stringify(value)]
  }

  return {
    queryText,
    contentClasses,
    contentStyles,
    filteredItems,
    showCreateOption,
    isFocused,
    isMenuOpen,
    isMultiple,
    clear,
    updateLocation,
    onBlur,
    onFocus,
    onEnter,
    onKeydown,
    removeInput,
    onBackspace,
    getIsSelected,
    getItemText,
    onClickOutside,
    onSelectItem,
    onSelectUnlisted,
    updateModelType,
    updateItemsPool,
    getItemFromItemsPool,
  }
}
