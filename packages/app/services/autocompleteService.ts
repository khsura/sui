import type { SelectItem } from '@khsura/sui/types'
import type { PropsAutocomplete } from '@khsura/sui/definitions'
import { computed, nextTick, ref, type EmitFn, type Ref } from 'vue'
import type {
  AutocompleteEmitEvents,
  AutocompleteModelType,
  AutocompleteModelTypeBase,
} from '@khsura/sui/types/autocomplete'
import lodash from 'lodash'
import {
  isDelimiter,
  getItemFromText,
  getSafeTypeModelValue,
  getItemFromValue,
  getItemText,
  getSelectItem,
  getItemValue,
} from '../helpers'
import { useMenuService } from '../services'

export const useAutocompleteService = <T extends boolean = false>(
  props: PropsAutocomplete<T>,
  model: Ref<AutocompleteModelType<T> | null | undefined>,
  emit: EmitFn<AutocompleteEmitEvents>,
) => {
  const queryText = ref('')
  const isFocused = ref(false)
  const isMenuOpen = ref(false)
  const inputElement = ref<HTMLElement | null>(null)
  let debounceTimeout: NodeJS.Timeout | number | null = null
  const itemsPool = ref<Record<string, SelectItem | undefined>>({})

  const { activatorElement, contentElement, contentClasses, contentStyles, updateLocation } = useMenuService(
    props,
    isMenuOpen,
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
    const foundItem =
      type === 'text' ? getItemFromText(props.items ?? [], inputText) : getItemFromValue(props.items ?? [], inputText)

    if (!foundItem) {
      if (props.multiple) {
        queryText.value = ''
      } else {
        model.value = undefined
        queryText.value = ''
      }

      return
    }

    const multiple = props.multiple === true

    if (multiple) {
      const val = getSafeTypeModelValue<true>(multiple, getChangeModelValueType(multiple))

      if (val?.includes(foundItem.value)) {
        model.value = getSafeTypeModelValue<T>(multiple, val.filter((item) => item !== foundItem.value) ?? [])
      } else {
        model.value = getSafeTypeModelValue<T>(multiple, [...(val ?? []), foundItem.value])
      }

      queryText.value = ''
    } else {
      const val = getChangeModelValueType(multiple)

      if (val === foundItem.value && !multiple) {
        queryText.value = foundItem.text

        return
      }

      const newValue = foundItem.value !== val ? foundItem.value : undefined

      model.value = getSafeTypeModelValue<T>(multiple, newValue)

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
    const multiple = props.multiple === true

    if (multiple) {
      const val = getSafeTypeModelValue<true>(multiple, getChangeModelValueType<true>(multiple))

      model.value = getSafeTypeModelValue<T>(multiple, val.filter((item) => item !== value) ?? [])
    } else {
      const val = getChangeModelValueType(multiple)

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

  const onClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    if (target.contains(inputElement.value)) {
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

    if (!props.multiple) {
      isMenuOpen.value = false
    }

    await nextTick()
    updateLocation()
  }

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
    console.log('updateModelType', model.value, getChangeModelValueType(multiple))
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
    model.value = getSafeTypeModelValue<T>(props.multiple, props.multiple ? [] : undefined)
    queryText.value = ''
  }

  const updateItemsPool = (items: SelectItem[] | string[]) => {
    itemsPool.value = lodash.merge(
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
    inputElement,
    activatorElement,
    contentElement,
    contentClasses,
    contentStyles,
    filteredItems,
    isFocused,
    isMenuOpen,
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
    updateModelType,
    updateItemsPool,
    getItemFromItemsPool,
  }
}
