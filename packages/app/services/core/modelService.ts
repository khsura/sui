/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { type WritableComputedRef } from 'vue'

/**
 * @description `useModelService(props, emit)`
 * @description `useModelService<boolean, 'model', typeof props, typeof emit>(props, emit, 'model')`
 */
export const useModelService = <
  ModelValue extends Props[ModelValueKey],
  ModelValueKey extends string = 'modelValue',
  Props extends Record<string, any> = Record<string, any>,
  Emit extends (event: any, value?: any) => void = (event: any, value?: any) => void,
>(
  props: Props,
  emit: Emit,
  value: ModelValueKey = 'modelValue' as ModelValueKey,
  options?: {
    formatter?: (newValue: Props[ModelValueKey], oldValue: Props[ModelValueKey] | null) => ModelValue
    onChange?: undefined | ((newValue: ModelValue, oldValue: Props[ModelValueKey] | null) => void)
    onUpdate?: undefined | ((newValue: ModelValue, oldValue: Props[ModelValueKey] | null) => void)
    noParsing?: boolean
    noEmitOnWatch?: boolean
  },
): WritableComputedRef<ModelValue> => {
  const event = `update:${value}`
  const formatter = options?.formatter ?? ((v) => v)
  const localModel = ref(formatter(props[value], null))
  const computedModelValue = computed(() => props[value])

  const getComparableValue = <T>(value: T): string | T => {
    if (typeof value !== 'object') {
      return value
    }

    return JSON.stringify(value)
  }

  const isDifferent = (a: Props[ModelValueKey], b: Props[ModelValueKey]) => {
    return getComparableValue(a) !== getComparableValue(b)
  }

  const getClone = <T>(value: T): T => {
    const typeofValue = typeof value

    if (typeofValue !== 'object') {
      return value
    }

    if (options?.noParsing) {
      if (Array.isArray(value)) {
        return [...value] as T
      }

      if (typeofValue === 'object') {
        return { ...value }
      }
    }

    return JSON.parse(JSON.stringify(value))
  }

  const updateModel = async (
    newValue: Props[ModelValueKey],
    updateOptions?: { forceEmitModelValue?: boolean; isInitialSetup?: boolean },
  ) => {
    const oldValue = getClone(localModel.value)
    const valueToSet = formatter(newValue, oldValue)
    const isChanged = isDifferent(valueToSet, newValue) || isDifferent(valueToSet, localModel.value)

    if (isChanged || updateOptions?.isInitialSetup) {
      localModel.value = valueToSet

      if (isChanged && (!options?.noEmitOnWatch || updateOptions?.forceEmitModelValue)) {
        emit(event, valueToSet)
        await nextTick()
      }

      options?.onChange?.(valueToSet, updateOptions?.isInitialSetup ? null : oldValue)
    }

    options?.onUpdate?.(valueToSet, updateOptions?.isInitialSetup ? null : oldValue)
  }

  const model = computed<ModelValue>({
    get: () => {
      return localModel.value ?? computedModelValue.value
    },
    set: async (value) => {
      await updateModel(value, { forceEmitModelValue: true })
    },
  })

  watch(computedModelValue, updateModel)

  onMounted(async () => {
    await updateModel(computedModelValue.value, { isInitialSetup: true })
  })

  return model
}
